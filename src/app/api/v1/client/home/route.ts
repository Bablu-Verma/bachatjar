import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import CategoryModel from "@/model/CategoryModel";
import BlogModel from "@/model/BlogModal";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import LiveDealModel from "@/model/LiveDeal";

export async function POST(req: Request) {
  await dbConnect();


  const currentDate = new Date();

  const body = await req.json();
  const { page = 1 , tab = 'hot_deals' } = body;

  const offerDealLimit = 4

  const skip_offer = ( page - 1) * offerDealLimit;


  try {
    const { } =
      await authenticateAndValidateUser(req);

      if (page === 1 && tab == 'hot_deals') {

        const live_deal = await LiveDealModel.find().limit(offerDealLimit).skip(skip_offer).lean()
        const offer_deal = await CampaignModel.find({
          product_status: "ACTIVE"
        })
          .skip(skip_offer)
          .limit(offerDealLimit)
          .populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug")
          .select('store category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id')
          .lean();




        const main_banner = await CampaignModel.find({
          product_status: "ACTIVE",
          main_banner: { $elemMatch: { is_active: true } },
        }).limit(6).populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug").select('store category main_banner product_slug slug_type title createdAt updatedAt').lean();
  
        const store = await StoreModel.find({ store_status: "ACTIVE" }).limit(10).select('-description -store_link -store_status').lean();
  
        const flash_sale = await CampaignModel.find({
          product_status: "ACTIVE",
          flash_sale: {
            $elemMatch: {
              is_active: true,
              end_time: { $gte: currentDate.toISOString() },
            },
          },
        }).select('store category flash_sale product_slug slug_type title  createdAt updatedAt _id').populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug").lean();
  
        const best_product = await CampaignModel.find({
          product_status: "ACTIVE",
          product_tags: "best",
        }).limit(10).select('store category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id').populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug").lean();
  
        const long_poster = await CampaignModel.find({
          product_status: "ACTIVE",
          long_poster: { $elemMatch: { is_active: true } },
        }).limit(4).select('store category long_poster product_slug slug_type  title').populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug").lean();
  
        const premium_product = await CampaignModel.find({
          product_status: "ACTIVE",
          premium_product: { $elemMatch: { is_active: true } },
        }).select('store category premium_product product_slug slug_type title ').populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug").limit(4).lean();
  
        const coupon = await CouponModel.find({ status: "ACTIVE" }).select('-description -expiry_date -status').limit(8).populate('store', 'name cashback_type cashback_rate store_link store_img').populate('category', 'name').lean();
  
        const category = await CategoryModel.find({ status: "ACTIVE" }).select('-status -description').lean();
  
        const blog = await BlogModel.find({ status: "ACTIVE" }).limit(4).select('-short_desc -desc -status -meta_title -meta_description -meta_keywords -canonical_url -og_image -og_title -og_description -twitter_card -schema_markup -reading_time -tags -publish_schedule -writer_email -keywords').lean();
  
        return NextResponse.json({
          success: true,
          message: "Home data fetched successfully.",
          data: {
            flash_sale,
            premium_product,
            long_poster,
            main_banner,
            coupon,
            category,
            blog,
            store,
            best_product,
            offer_deal,
            live_deal
          },
        });
      } else if( tab  ==  'live_offer') {
        const live_deal = await LiveDealModel.find().limit(offerDealLimit).skip(skip_offer).lean()
 
        // ✅ Page > 1: only offer_deal
        return NextResponse.json({
          success: true,
          message: "Offer deal loaded successfully.",
          data: {
            live_deal
          },
        });
      } else if( tab === 'hot_deals') {
        const offer_deal = await CampaignModel.find({
          product_status: "ACTIVE"
        })
          .skip(skip_offer)
          .limit(offerDealLimit)
          .populate("store", "name cashback_type cashback_rate store_link store_img")
          .populate("category", "name slug")
          .select('store category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id')
          .lean();


        return NextResponse.json({
          success: true,
          message: "Offer deal loaded successfully.",
          data: {
            offer_deal
          },
        });
      }

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
