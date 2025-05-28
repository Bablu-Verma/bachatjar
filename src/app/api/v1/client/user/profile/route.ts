import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ConformAmountModel from "@/model/ConformAmountModel";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
   
const { authenticated, user, message } =
      await authenticateAndValidateUser(req);

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
    
    const userDetails = await UserModel.findOne({ email: user?.email }).select('-password -verify_code -user_status');

    if (!userDetails) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

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


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User details retrieved successfully.",
        data: userDetails,
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve user details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve user details.",
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
