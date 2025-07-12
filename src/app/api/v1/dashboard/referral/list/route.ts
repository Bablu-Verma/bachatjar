import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReferralModel from "@/model/ReferralModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (usertype !== "admin" ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const requestData = await req.json();
    const { title, status, category, startDate, endDate, page = 1, limit = 30 } = requestData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // Title Filter (Case-insensitive)
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    // Status Filter
    if (status && ["ACTIVE", "PAUSE", "DELETE"].includes(status)) {
      query.status = status;
    } else {
      query.status = { $in: ["ACTIVE", "PAUSE", "DELETE"] };
    }

    // Category Filter
    if (category) {
      query.category = category;
    }

    // Date Range Filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const referrals = await ReferralModel.find(query)
      .populate("category", "name slug") 
      .skip(skip)
      .limit(limit)
      .select('-description')
      .sort({ createdAt: -1 });

    const totalReferrals = await ReferralModel.countDocuments(query);
    const totalPages = Math.ceil(totalReferrals / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Referral campaigns fetched successfully.",
        data: referrals,
        pagination: {
          currentPage: page,
          totalPages,
          totalReferrals,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch referral campaigns:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch referral campaigns.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
