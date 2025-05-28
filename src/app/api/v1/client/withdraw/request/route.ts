import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel"; 
import UserUPIModel from "@/model/UserUPIModel";
import { generateOTP } from "@/helpers/server/server_function";
import { withdrawal_request_verify } from "@/email/withdrawal_request_verify";
import ConformAmountModel from "@/model/ConformAmountModel";



export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userId = user?._id;
    const body = await req.json();
    const { bank_id:upi_id, amount } = body;

    console.log('code yaha pr aayaya h ', body)
  
    if (!upi_id || !amount) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "UPI ID and Amount are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid amount format.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const MIN_WITHDRAWAL = 100; 
    const MAX_WITHDRAWAL = 10000; 

    if (amount < MIN_WITHDRAWAL) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: `Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}.`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (amount > MAX_WITHDRAWAL) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: `Maximum withdrawal amount is ₹${MAX_WITHDRAWAL}.`,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const amountDetails = await ConformAmountModel .findOne({ user_id: userId });

    if (!amountDetails) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User amount details not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    if (amountDetails.amount < amount) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Insufficient balance for withdrawal.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const upiRecord = await UserUPIModel.findOne({
      user_id: userId,
      upi_id: upi_id,
      status: "ACTIVE",
    });

    if (!upiRecord) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid or inactive UPI ID.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // ✅ OTP + Request Create
    const create_otp = generateOTP();

    const newRequest = await WithdrawalRequestModel.create({
      user_id: userId,
      upi_id: upi_id,
      otp: create_otp,
      amount: amount,
      status: "WITHDRAWAL_CREATE",
      history: [
        {
          status: "WITHDRAWAL_CREATE",
          details: "Withdrawal request created",
          date: new Date(),
        },
      ],
    });


    const requestData = newRequest.toObject(); 
    delete requestData.otp;


    withdrawal_request_verify(create_otp, user?.email);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request submitted successfully.",
        data: requestData,
        otp:create_otp
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to create withdrawal request:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to create withdrawal request.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
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
}
