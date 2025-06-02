
import { changepassword_request_email } from "@/email/changepassword_request";
import { generateJwtToken } from "@/helpers/server/server_function";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

import { NextResponse } from "next/server";

// varify valid user

export async function POST(request: Request) {
  await dbConnect();


  try {
    const { email } = await request.json();

    if (!email) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    const findUser = await UserModel.findOne({ email: email });


    if (!findUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "User Not Found",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!findUser.email_verified) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Register Again, You are not verifyed User",
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
      name: findUser.name
    };

    const minutes_30 = 60 * 30;
    const JwtToken = generateJwtToken(Payload, minutes_30);


    changepassword_request_email(email,
      findUser.name,
      JwtToken);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Check Your register email, & Reset password",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verify user", error);
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
