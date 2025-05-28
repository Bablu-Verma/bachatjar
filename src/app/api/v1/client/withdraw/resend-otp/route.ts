import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { withdrawal_request_verify } from "@/email/withdrawal_request_verify";
import { generateOTP } from "@/helpers/server/server_function";

export async function POST(request: Request) {
  await dbConnect();

  const { authenticated, user, message } = await authenticateAndValidateUser(
    request
  );

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

  try {
    const { withdrawal_request_id } = await request.json();

    if (!withdrawal_request_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const withdrawalRequest = await WithdrawalRequestModel.findOne({
      _id: withdrawal_request_id,
      user_id: user?._id,
    }).select("+otp");

    if (!withdrawalRequest) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (withdrawalRequest.status !== "WITHDRAWAL_CREATE") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Cannot resend OTP for this withdrawal request.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const create_otp = generateOTP();

    withdrawalRequest.otp = create_otp;
    withdrawalRequest.requested_at = new Date();
    await withdrawalRequest.save();

    const email = user?.email || "";
    withdrawal_request_verify(create_otp, email);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "OTP resent successfully.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error resending OTP:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to resend OTP.",
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
