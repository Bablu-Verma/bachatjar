import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextResponse } from "next/server";

const STATUSES = ["WITHDRAWAL_CREATE", "PENDING", "APPROVED", "REJECTED"] as const;

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "Unauthorized" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    const { withdrawal_id, new_status, details } = await req.json();

    if (!withdrawal_id || !new_status || !STATUSES.includes(new_status)) {
      return NextResponse.json(
        { success: false, message: "Invalid withdrawal ID or status" },
        { status: 400 }
      );
    }

    const withdrawalRequest = await WithdrawalRequestModel.findById(withdrawal_id);

    if (!withdrawalRequest) {
      return NextResponse.json(
        { success: false, message: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    // Update status and add to history
    withdrawalRequest.status = new_status;
    withdrawalRequest.history.push({
      status: new_status,
      details: details || `Status changed to ${new_status} by admin`,
      date: new Date(),
    });

    await withdrawalRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: "Withdrawal request status updated successfully.",
        data: withdrawalRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating withdrawal request",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
