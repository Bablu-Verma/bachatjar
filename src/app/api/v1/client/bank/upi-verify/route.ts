
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import { sendMessage } from "@/lib/sendMessage";
import UserUPIModel from "@/model/UserUPIModel";

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
    const { otp, documant_id } = await request.json();

    if (!otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!documant_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "documant_id is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    // console.log("user otp ",otp)

    if (String(otp).length !== 4) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter a 4-digit OTP",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    
    const upi_document = await UserUPIModel.findOne({ _id:documant_id, user_id: user?._id});

    if (!upi_document) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Document not found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }





    if (otp != upi_document.otp) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Enter a valid OTP",
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
    const otpIssuedTime = new Date(upi_document.updatedAt); 
    const otpExpiryLimit = 10 * 60 * 1000; 

    if (now.getTime() - otpIssuedTime.getTime() > otpExpiryLimit) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "OTP is only valid for 10 minutes",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    
    upi_document.status = "ACTIVE";
    
    await upi_document.save();

await sendMessage({
  userId: upi_document.user_id,
  title: "Your UPI ID Has Been Successfully Linked to BachatJar",
  body: `Hi ${upi_document.user_email || "there"},

Your UPI ID **${upi_document.upi_id}** has been successfully linked to your BachatJar account. You’re now all set to receive cashback and rewards directly to your UPI!

For your security, if you didn’t perform this action, please remove the UPI from your account settings and contact our support immediately.

Keep saving,  
The BachatJar Team 💸`
});


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "UPI verified successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to verify user",
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
