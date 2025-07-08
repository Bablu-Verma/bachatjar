

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormModel from "@/model/ClaimFormData";

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

    const { claim_id } = await req.json();

    if (!claim_id) {
      return NextResponse.json(
        { success: false, message: "claim_id is required" },
        { status: 400 }
      );
    }

    const claimForm = await ClaimFormModel.findById(claim_id)
      .populate("store_id", "name")
      .populate("user_id", "name email")
      .lean();

    if (!claimForm) {
      return NextResponse.json(
        { success: false, message: "Claim form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Claim form retrieved", data: claimForm },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching claim form:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
