import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextResponse } from "next/server";

const STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { status, page = 1, limit = 10 } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { user_id: user?._id };
    query.status = { $ne: "WITHDRAWAL_CREATE" };


    if (status && STATUSES.includes(status)) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [withdrawals, total] = await Promise.all([
      WithdrawalRequestModel.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      WithdrawalRequestModel.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Withdrawal requests fetched successfully.",
        data: withdrawals,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching withdrawal requests.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
