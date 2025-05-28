import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: Admin role required",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();

    const {
      email,
      name,
      phone,
      profileImage,
      dob,
      gender,
      subscribe_email,
      user_status,
      role,
    } = requestData;

    if (!email || typeof email !== "string") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Email is required and must be a string",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (subscribe_email) updateData.subscribe_email = subscribe_email;
    if (user_status) updateData.user_status = user_status;
    if (role) updateData.role = role;
    if (profileImage) updateData.profile = profileImage;

    // Update user
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update user profile.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "User profile updated successfully.",
       
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to update user profile:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to update user profile.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
