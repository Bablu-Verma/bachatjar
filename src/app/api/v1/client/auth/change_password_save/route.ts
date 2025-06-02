
import jwt from "jsonwebtoken";
import {
  createHashPassword,
} from "@/helpers/server/server_function";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";

import { NextResponse, NextRequest } from "next/server";

interface IRequestBody {
  email: string;
  password: string;
}

interface Idecode {
  email: string,
  name: string,
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body: IRequestBody = await req.json();

    const { password } = body;

    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Some Error Try Again",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Some Error Try Again",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }


    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret key is not set in environment variables.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as Idecode;


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

    const User = await UserModel.findOne({
      email: decoded.email,
    })

    if (!User) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Some Error Try Again",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashPassword = await createHashPassword(password);

    User.password = hashPassword

    await User.save()

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Change Password Successfully",

      }),
      {
        status: 200,
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
