/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import CampaignModel from "@/model/CampaignModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { slug, page = 1, tabtype } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Slug is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const query: any = { slug, store_status: "ACTIVE" };

    const store = await StoreModel.findOne(query)
      .select("-store_status")
      .populate("category", "name slug");

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const limit = 10;
    const skip = (page - 1) * limit;

    let relatedProducts: any[] = [];
    let relatedCoupons: any[] = [];
    let relatedStores: any[] = [];
    let topStores: any[] = [];

    if (page === 1) {
    
      relatedProducts = await CampaignModel.find({ store: store._id,product_status:'ACTIVE' })
        .select(
          "store category extrnal_url offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title createdAt updatedAt _id"
        )
        .populate("store", "name cashback_type store_type cashback_rate store_link store_img")
        .populate("category", "name slug")
        .limit(limit)
        .lean();

        // console.log('relatedProducts', relatedProducts)

      relatedCoupons = await CouponModel.find({ store: store._id, status:'ACTIVE' })
        .select("-description -status")
        .populate("store", "name cashback_type cashback_rate store_link store_img")
        .populate("category", "name slug")
        .limit(limit)
        .lean();
 
        // console.log('relatedCoupons', relatedCoupons)


      relatedStores = await StoreModel.find({
        category: store.category?._id,
        slug: { $ne: store.slug },
        store_status: "ACTIVE",
      })
        .select("name slug store_img")
        .populate("category", "name slug")
        .limit(10)
        .lean();

      topStores = await StoreModel.find({ store_status: "ACTIVE" })
        .select("name slug store_img")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();
    } else {
      // 👇 page > 1 hone par sirf product ya coupon paginate karna
      if (tabtype === "Product") {
        relatedProducts = await CampaignModel.find({ store: store._id })
          .select(
            "store category offer_price extrnal_url calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title createdAt updatedAt _id"
          )
          .populate("store", "name store_type cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug")
          .skip(skip)
          .limit(limit)
          .lean();
      } else if (tabtype === "Coupons") {
        relatedCoupons = await CouponModel.find({ store: store._id })
          .select("-description -status")
          .populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug")
          .skip(skip)
          .limit(limit)
          .lean();
      }
    }


    
   


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Data fetched successfully.",
        data: {
          ...(page === 1 ? { store, related_stores: relatedStores, top_stores: topStores } : {}),
          related_product: relatedProducts,
          related_coupons: relatedCoupons,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Failed to fetch store details:", error.message);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch store details.",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
