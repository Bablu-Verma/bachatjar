
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";

import UserUPIModel from "@/model/UserUPIModel"; 
import  "@/model/UserModel";
import { NextResponse } from "next/server";

// Verify valid user
export async function POST(request: Request) {
  await dbConnect();



  const { authenticated, user, message } =
    await authenticateAndValidateUser(request);

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
    // Fetch UPI document using the correct model
    const upi_document = await UserUPIModel.find({ user_id: user?._id}).select('-createdAt -updatedAt -otp -status').populate("user_id","name" );

    if (!upi_document) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No UPI details found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "UPI verified successfully",
        data:upi_document
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fatching upi:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fatch upi",
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
