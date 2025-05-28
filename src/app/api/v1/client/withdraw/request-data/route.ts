import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ConformAmountModel from "@/model/ConformAmountModel";
import UserUPIModel from "@/model/UserUPIModel";

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
    
    const amountDetails = await ConformAmountModel.findOne({ user_id: userId });

    console.log(amountDetails)

    const upiDetails = await UserUPIModel.find({
      user_id: userId,
      status: "ACTIVE",
    }).select("-otp");

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request details retrieved successfully.",
        data: {
          amountDetails: amountDetails ? amountDetails.amount : null,
          upiDetails: upiDetails || [],
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
      console.error("Failed to retrieve withdrawal request details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve withdrawal request details.",
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
