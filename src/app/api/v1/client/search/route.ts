import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import StoreModel from "@/model/StoreModel";

import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";
import ReferralModel from "@/model/ReferralModel";


export async function POST(req: Request) {
  await dbConnect();

  try {
    // Extract search query from request body
    const requestData = await req.json();
    const { query } = requestData;

    if (!query || query.trim() === "") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Search query is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    
    const searchFilter = {
      $regex: query,
      $options: "i", 
    };

    // Fetching active results with a limit of 10 per category
    const [ stores, coupons, campaigns, referral] = await Promise.all([
      StoreModel.find({ name: searchFilter,  store_status: "ACTIVE" }).limit(6).select('-description  -cashback_type -store_status').lean(),

      CouponModel.find({ title: searchFilter, status: "ACTIVE" }).limit(6).populate('store', 'name slug store_img').populate('category', 'name slug').select('-description -expiry_date -status').lean(),

      CampaignModel.find({ title: searchFilter, product_status: "ACTIVE" }).limit(6).populate('store', 'name cashback_type cashback_rate store_link store_img').populate('category', 'name slug').select('store category offer_price calculated_cashback calculation_mode product_img product_tags  actual_price product_slug slug_type title  createdAt updatedAt _id').lean(),

       ReferralModel.find({title: searchFilter, status: 'ACTIVE' })
            .populate("category", "name slug")
            .limit(6)
            .select('-description -referralLink')
            .sort({ createdAt: -1 }).lean()
    ]);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Search results retrieved successfully.",
        data: {
          stores,
          coupons,
          campaigns,
          referral
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Search failed:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to perform search.",
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
