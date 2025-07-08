// File: /app/api/admin/claim-form/update-status/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormModel from "@/model/ClaimFormData";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

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

    const { claim_id, status } = await req.json();

    if (!claim_id || !status) {
      return NextResponse.json(
        { success: false, message: "claim_id and status are required" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const updatedClaim = await ClaimFormModel.findByIdAndUpdate(
      claim_id,
      { status },
      { new: true }
    )
      .populate("store_id", "name")
      .populate("user_id", "name email")
      .lean();

    if (!updatedClaim) {
      return NextResponse.json(
        { success: false, message: "Claim form not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Claim status updated", data: updatedClaim },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating claim status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
