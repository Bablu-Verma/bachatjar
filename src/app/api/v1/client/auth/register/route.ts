import { user_verify_email } from "@/email/user_verify";
import {
  createExpiryTime,
  createHashPassword,
  generateJwtToken,
  generateOTP,
} from "@/helpers/server/server_function";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

import { NextResponse, NextRequest } from "next/server";

interface IRequestBody {
  email: string;
  password: string;
  name: string;
  accept_terms_conditions_privacy_policy: boolean;
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body: IRequestBody = await req.json();

    const { email, password, name, accept_terms_conditions_privacy_policy } =
      body;

    // Validate the form fields
    if (!name || name.trim().length < 3) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid name. It must be at least 3 characters long.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid email address.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!password || password.length < 8) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Password must be at least 8 characters long.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const fiedUser = await UserModel.findOne({
      email: email,
    }).select("+email_verified");

    if (fiedUser) {
      if (fiedUser.email_verified == false) {
        // if user is exixit but verify false

        const result = await UserModel.deleteOne({ email: fiedUser.email });
        if (result.deletedCount > 0) {
          // console.log("User removed successfully.");
        } else {
          // console.log("No user found.");
        }
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Email already exists, Please choose another Email",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    const hashPassword = await createHashPassword(password);
    const expiry_time = createExpiryTime(0, 30);
    const create_otp = generateOTP();

    const create_user = new UserModel({
      name,
      email,
      password: hashPassword,
      verify_code: create_otp,
      verify_code_expiry: expiry_time,
      accept_terms_conditions_privacy_policy:
        accept_terms_conditions_privacy_policy,
    });

    user_verify_email(create_otp, email);

    const Payload = {
      email,
    };

    const minutes_30 = 60 * 30; // 30 minutes in seconds
    const JwtToken = generateJwtToken(Payload, minutes_30);

    const new_user = await create_user.save();
    const userData = new_user.toObject();
    delete userData.password;
    delete userData.accept_terms_conditions_privacy_policy;
    delete userData.email_verified;
    delete userData.phone_verified;
    delete userData.verify_code;
    delete userData.verify_code_expiry;
    delete userData.user_status;
    delete userData.subscribe_email;
    delete userData.__v;

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Register successfully, Verify your Email",
        user: userData,
        token: JwtToken,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to register user",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
