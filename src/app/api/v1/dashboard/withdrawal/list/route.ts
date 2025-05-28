import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import WithdrawalRequestModel from "@/model/WithdrawalRequestModel";
import { NextResponse } from "next/server";

const STATUSES = ["WITHDRAWAL_CREATE", "PENDING", "APPROVED", "REJECTED"] as const;

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated,  usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "User is not authenticated" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: You do not have the required role" },
        { status: 403 }
      );
    }

    const { user_id, status, page = 1, limit = 5, startdate, enddate } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // Filter by user_id (optional)
    if (user_id) {
      query.user_id = user_id;
    }

    // Filter by status, excluding WITHDRAWAL_CREATE by default
    if (status && STATUSES.includes(status)) {
      if (status !== "WITHDRAWAL_CREATE") {
        query.status = status;
      } else {
       
        query.status = "WITHDRAWAL_CREATE";
      }
    } else {
      query.status = { $ne: "WITHDRAWAL_CREATE" };
    }

    // Filter by date range
    if (startdate || enddate) {
      query.createdAt = {};
      if (startdate) {
        query.createdAt.$gte = new Date(startdate);
      }
      if (enddate) {
        query.createdAt.$lte = new Date(enddate);
      }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      WithdrawalRequestModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)).populate("user_id",'name email'),
      WithdrawalRequestModel.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Withdrawal requests fetched successfully.",
        data,
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
