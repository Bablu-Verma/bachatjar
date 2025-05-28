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

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only admin can delete users" },
        { status: 403 }
      );
    }

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "User email is required" },
        { status: 400 }
      );
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { user_status: "REMOVED" },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found or already removed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User removed successfully", data: updatedUser },
      { status: 200 }
    );
  }  catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to delete user:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete user.",
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
