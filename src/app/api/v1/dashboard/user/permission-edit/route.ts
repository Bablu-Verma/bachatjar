import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate Admin
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "User is not authenticated" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admin role required" },
        { status: 403 }
      );
    }

    // Get request data
    const { email, role, status } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required and must be a valid string" },
        { status: 400 }
      );
    }

   
    const validRoles = ["user", "admin", "data_editor", "blog_editor"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "Invalid role. Allowed values: user, admin, data_editor, blog_editor" },
        { status: 400 }
      );
    }

    
    const validStatuses = ["ACTIVE", "REMOVED"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status. Allowed values: ACTIVE, REMOVED" },
        { status: 400 }
      );
    }

    // Update User Permissions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: any = {};
    if (role) updateFields.role = role;
    if (status) updateFields.user_status = status;

    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found or failed to update permissions" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User permissions updated successfully" },
      { status: 200 }
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