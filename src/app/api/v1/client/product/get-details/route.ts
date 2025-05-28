import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { product_slug } = await req.json(); 

    if (!product_slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Filter condition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = { product_slug };

    
    filters.product_status = 'ACTIVE'
    
    const product = await CampaignModel.findOne(filters)
    .populate('store', 'name cashback_type cashback_rate store_link slug store_img')
    .populate('category', 'name slug');

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const relatedProducts = await CampaignModel.find({
      store: product.store._id,
      _id: { $ne: product._id }, 
      product_status: "ACTIVE", 
    }).select('store category offer_price calculated_cashback calculation_mode product_img product_tags  actual_price product_slug slug_type title _id').lean()
      .limit(10)
      .populate('store', 'name cashback_type cashback_rate store_link store_img')
      .populate('category', 'name slug');
    
    
    const relatedcoupons = await CouponModel.find({ store: product.store._id, status:"ACTIVE" })
      .limit(10).populate('store', 'name cashback_type cashback_rate store_link store_img')
      .populate('category', 'name slug');


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product details retrieved successfully.",
        data: {
          product,
          relatedProducts,
          relatedcoupons,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve product details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve product details.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
