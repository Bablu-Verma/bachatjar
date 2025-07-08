// File: /app/api/claim-form-template/delete/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormTemplateModel from "@/model/ClaimFormTemplate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "Authentication required" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    const { templateId } = await req.json();

    if (!templateId) {
      return NextResponse.json(
        { success: false, message: "templateId is required" },
        { status: 400 }
      );
    }

    const deleted = await ClaimFormTemplateModel.findByIdAndDelete(templateId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Template not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Claim form template deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting claim form template:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
