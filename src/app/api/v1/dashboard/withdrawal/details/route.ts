import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextResponse } from "next/server";

// GET withdrawal request details
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
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }


    const { withdrawal_id } = await req.json();

    if (!withdrawal_id) {
      return NextResponse.json(
        { success: false, message: "withdrawal_id is required" },
        { status: 400 }
      );
    }

    const withdrawalRequest = await WithdrawalRequestModel.findById(withdrawal_id).populate("user_id");

    if (!withdrawalRequest) {
      return NextResponse.json(
        { success: false, message: "Withdrawal request not found" },
        { status: 404 }
      );
    }

   

    return NextResponse.json(
      {
        success: true,
        message: "Withdrawal request fetched successfully",
        data: withdrawalRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching withdrawal request:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
