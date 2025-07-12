/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/CategoryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CampaignModel from "@/model/CampaignModel";
import CouponModel from "@/model/CouponModel";
import StoreModel from "@/model/StoreModel";
import ReferralModel from "@/model/ReferralModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { } = await authenticateAndValidateUser(req);
    const requestData = await req.json();
    const { slug, page = 1, tabtype = null } = requestData;

    const limit = 10;

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Slug is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const query: any = { slug, status: 'ACTIVE' };
    const category_details: any = await CategoryModel.findOne(query).select('-status').lean();

    if (!category_details) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Category not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const skip = (page - 1) * limit;

    let relatedProducts: any[] = [];
    let relatedCoupons: any[] = [];
    let relatedStore: any[] = [];
    let referrals: any[] = []

    if (!tabtype || tabtype === 'Product') {
      relatedProducts = await CampaignModel.find({ category: category_details._id, product_status: 'ACTIVE' })
        .select('-user_id -description -product_tags -long_poster -main_banner -premium_product -flash_sale -t_and_c -meta_title -meta_keywords -meta_description -meta_robots -canonical_url -structured_data -og_image -og_title -og_description -product_status')
        .populate("store", "name cashback_type cashback_rate store_link store_img")
        .populate("category", "name slug")
        .skip(skip)
        .limit(limit)
        .lean();
    }

    if (!tabtype || tabtype === 'Coupon') {
      relatedCoupons = await CouponModel.find({ category: category_details._id, status: 'ACTIVE' })
        .select('-description -expiry_date -category -status')
        .populate("store", "name cashback_type cashback_rate store_link store_img")
        .populate("category", "name slug")
        .skip(skip)
        .limit(limit)
        .lean();
    }

    if (!tabtype || tabtype === 'Store') {
      relatedStore = await StoreModel.find({ category: category_details._id, store_status: 'ACTIVE' })
        .select('-tc -store_status -description')
        .skip(skip)
        .limit(limit)
        .lean();
    }
    if (!tabtype || tabtype === 'Referral') {
      referrals = await ReferralModel.find({ category: category_details._id, status: 'ACTIVE' })
        .populate("category", "name slug")
        .limit(10)
        .select('-description -referralLink')
        .sort({ createdAt: -1 }).lean();

    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories details fetched successfully.",
        data: {
          category_details: tabtype ? undefined : category_details,
          relatedProducts,
          relatedCoupons,
          relatedStore,
          referrals
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch categories.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
