import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import ConformAmountModel from "@/model/ConformAmountModel";
import { sendMessage } from "@/lib/sendMessage";

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


    const requestdata = await request.json();


    const { withdrawal_request_id, otp } = requestdata

    if (!withdrawal_request_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request ID are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Withdrawal request ID and OTP are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (String(otp).length !== 4) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter a valid 4-digit OTP.",
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
    }).select('+otp');

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
          message: "This withdrawal request is already verified or processed.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const now = new Date();
    const updatedAt = withdrawalRequest.updatedAt;
    const diffInMinutes = (now.getTime() - updatedAt.getTime()) / (1000 * 60);

    if (diffInMinutes > 30) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP expired. Please resend OTP.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // console.log('withdrawalRequest',withdrawalRequest)

    if (withdrawalRequest.otp !== Number(otp)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid OTP entered.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    withdrawalRequest.status = "PENDING";
    withdrawalRequest.history.push({
      status: "PENDING",
      details: "Withdrawal marked as pending by Team",
      date: new Date(),
    });
    withdrawalRequest.otp = undefined;
    await withdrawalRequest.save();


    await ConformAmountModel.findOneAndUpdate(
      { user_id: user?._id },
      { $inc: { amount: -withdrawalRequest.amount } },
      { new: true }
    );


    const conformAmount = await ConformAmountModel.findOne({ user_id: user?._id }).select('-createdAt -updatedAt');
    const withdrawalRequests = await WithdrawalRequestModel.find({ user_id: user?._id }).select('-upi_id -requested_at -processed_at -createdAt -updatedAt');


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


    await sendMessage({
      userId: withdrawalRequest.user_id,
      title: "Your Withdrawal Request Has Been Received – BachatJar",
      body: `Hi ${user?.email || "there"},

We’ve received your withdrawal request of ₹${withdrawalRequest.amount} to UPI ID **${withdrawalRequest.upi_id}**.

If this was you, no further action is needed — your request is being processed and will be completed shortly.

Didn't make this request?  
Please contact our support team immediately to secure your account.

Thank you,  
The BachatJar Team 💸`
    });


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request verified successfully.",
        summary: {
          conform_cb,
          total_cb: total_cb,
          total_hold: total_hold,
          withdrawal_pending: withdrawal_pending,
          total_withdrawal: total_withdrawal
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verifying withdrawal request:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to verify withdrawal request.",
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
