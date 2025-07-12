import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReferralModel from "@/model/ReferralModel";


export async function POST(req: Request) {
  await dbConnect();

  try {
   


    const requestData = await req.json();
    const {  page = 1, limit = 20 } = requestData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    query.status = 'ACTIVE';

    // Pagination
    const skip = (page - 1) * limit;

    const referrals = await ReferralModel.find(query)
      .populate("category", "name slug") 
      .skip(skip)
      .limit(limit)
      .select('-description -referralLink')
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
