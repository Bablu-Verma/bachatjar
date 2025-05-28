import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the admin
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "User is not authenticated" },
        { status: 401 }
      );
    }

// console.log( authenticated, usertype, message)

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only admin can access user details" },
        { status: 403 }
      );
    }

    // Parse request body
    const { email } = await req.json();


    // console.log(email)

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const userDetails = await UserModel.findOne({ email });
    

    if (userDetails) {
      userDetails.password = undefined;
      userDetails.verify_code = undefined;
    }
   

    return NextResponse.json(
      { success: true, message: "User details retrieved successfully", data:userDetails },
      { status: 200 }
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
