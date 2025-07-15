import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const { page = 1, tag = 'all' } = body;
  const offerDealLimit = 16;
  const skip_offer = (page - 1) * offerDealLimit;

  try {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      product_status: "ACTIVE"
    };

    // Apply tag filter only if tag is not "all"
    if (tag !== 'all') {
      filter.product_tags = tag;
    }

    const offer_deal = await CampaignModel.find(filter)
      .skip(skip_offer)
      .limit(offerDealLimit)
       .sort({ createdAt: -1 })
      .populate("store", "name cashback_type  cashback_rate store_link store_type store_img")
      .populate("category", "name slug")
      .select('store extrnal_url category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title createdAt updatedAt _id')
      .lean();

    return NextResponse.json({
      success: true,
      message: "Deal data fetched successfully.",
      data: offer_deal
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching campaigns:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch campaigns.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
