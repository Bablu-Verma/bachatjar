// File: /app/api/claim-form-template/get-one/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormTemplateModel from "@/model/ClaimFormTemplate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "Authentication required" },
        { status: 401 }
      );
    }

    const { store } = await req.json();

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store ID is required" },
        { status: 400 }
      );
    }

    const template = await ClaimFormTemplateModel.findOne({ store })
      .populate("store", "name")
      .lean();

    if (!template) {
      return NextResponse.json(
        { success: false, message: "Template not found for this store" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Claim form template fetched successfully",
        data: template,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
