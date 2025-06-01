import {
  generateJwtToken,
} from "@/helpers/server/server_function";
import dbConnect from "@/lib/dbConnect";
import ConformAmountModel from "@/model/ConformAmountModel";
import UserModel from "@/model/UserModel";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), 
  });
}


interface IRequestBody {
  google_token: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  await dbConnect();

  try {
    const body: IRequestBody = await req.json();
    const { google_token } = body;

    if (!google_token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "token is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


     const decoded = await admin.auth().verifyIdToken(google_token);
    const {  email, name, picture } = decoded;

     if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email not found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!name) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Name not found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    let User = await UserModel.findOne({
      email,
    });

    if (!User) {

    User = await UserModel.create({
        name: name || "No Name",
        email,
        profile: picture,
        password: "GOOGLE_OAUTH_USER", 
        email_verified: true,
        accept_terms_conditions_privacy_policy: true,
    });

    }

   if (User.user_status == "REMOVED") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "you are not valid user, contact to support",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

   

    const Payload = {
      email,
      role: User.role,
      _id: User._id,
    };
    const days_15 = 60 * 60 * 24 * 15; 
    const JwtToken = generateJwtToken(Payload, days_15);

    const userData = User.toObject();
    delete userData.password;
    delete userData.accept_terms_conditions_privacy_policy;
    delete userData.email_verified;
    delete userData.phone_verified;
    delete userData.verify_code;
    delete userData.verify_code_expiry;
    delete userData.user_status;
    delete userData.subscribe_email;
    delete userData.__v;

    const conformAmount = await ConformAmountModel.findOne({
      user_id: User._id,
    }).select("-createdAt -updatedAt");
    const withdrawalRequests = await WithdrawalRequestModel.find({
      user_id: User._id,
    }).select("-upi_id -requested_at -processed_at -createdAt -updatedAt");

    const conform_cb = conformAmount?.amount || 0;
    const total_hold = conformAmount?.hold_amount || 0;

    let withdrawal_pending = 0;
    let total_withdrawal = 0;

    withdrawalRequests.forEach((request) => {
      if (request.status === "PENDING") {
        withdrawal_pending += request.amount;
      }
      if (request.status === "APPROVED") {
        total_withdrawal += request.amount;
      }
    });

    const total_cb = conform_cb + withdrawal_pending + total_withdrawal;

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Login successful",
        summary: {
          conform_cb,
          total_cb: total_cb,
          total_hold: total_hold,
          withdrawal_pending: withdrawal_pending,
          total_withdrawal: total_withdrawal,
        },
        user: userData,
        token: JwtToken,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during authentication:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Internal Server Error",
      }),
      { status: 500 }
    );
  }
}
