import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import CategoryModel from "@/model/CategoryModel";
import BlogModel from "@/model/BlogModal";
import StoreModel from "@/model/StoreModel";
import CouponModel from "@/model/CouponModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import WishlistModel from "@/model/WishlistModel";
import Message from "@/model/Message";
import ReferralModel from "@/model/ReferralModel";


export async function POST(req: Request) {
  await dbConnect();
  const currentDate = new Date();

  try {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let watchlist_array: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let notification_array: any[] = [];

    const { authenticated, user } = await authenticateAndValidateUser(req);

    if (authenticated && user?._id) {
      const user_id = user._id;

      const watchlist = await WishlistModel.findOne({ user_id });

      if (watchlist?.campaigns?.length) {
        watchlist_array = await CampaignModel.find({
          _id: { $in: watchlist.campaigns },
        })
          .select('store category extrnal_url offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title createdAt updatedAt _id')
          .populate('category', 'name slug')
          .populate('store', 'name cashback_type cashback_rate store_link store_img')
          .lean();
      }

      notification_array = await Message.find({
        userId: user_id,
        read: 'FALSE',
      })
        .sort({ updatedAt: -1 })
        .lean();
    }



    const main_banner = await CampaignModel.find({
      product_status: "ACTIVE",
      main_banner: { $elemMatch: { is_active: true } },
    }).limit(6).populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug").select('store category extrnal_url  main_banner product_slug slug_type title createdAt upDatedAt').sort({ updatedAt: -1 }).lean();

    const referrals = await ReferralModel.find({ status: 'ACTIVE' })
      .populate("category", "name slug")
      .limit(10)
      .select('-description -referralLink')
      .sort({ updatedAt: -1 }).lean();

    const store = await StoreModel.find({ store_status: "ACTIVE" }).limit(16).select('-description -tc -store_link -store_status').sort({ updatedAt: -1 }).lean();

    const flash_sale = await CampaignModel.find({
      product_status: "ACTIVE",
      flash_sale: {
        $elemMatch: {
          is_active: true,
          end_time: { $gte: currentDate.toISOString() },
        },
      },
    }).select('store extrnal_url category flash_sale product_slug slug_type title  createdAt updatedAt _id').populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug").sort({ updatedAt: -1 }).lean();

    const best_product = await CampaignModel.find({
      product_status: "ACTIVE",
      product_tags: "best",
    }).limit(10).sort({ updatedAt: -1 }).select('store category offer_price calculated_cashback extrnal_url calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id').populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug").lean();

    const live_product = await CampaignModel.find({
      product_status: "ACTIVE",
      product_tags: "new",
    }).limit(10).sort({ updatedAt: -1 }).select('store category offer_price calculated_cashback calculation_mode extrnal_url product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id').populate("store", "name cashback_type cashback_rate store_link store_img")
      .lean();


    const long_poster = await CampaignModel.find({
      product_status: "ACTIVE",
      long_poster: { $elemMatch: { is_active: true } },
    }).limit(4).select('store category extrnal_url long_poster product_slug slug_type  title').populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug").sort({ updatedAt: -1 }).lean();

    const premium_product = await CampaignModel.find({
      product_status: "ACTIVE",
      premium_product: { $elemMatch: { is_active: true } },
    }).select('store category extrnal_url premium_product product_slug slug_type title ').populate("store", "name cashback_type cashback_rate store_link store_img")
      .populate("category", "name slug").limit(4).lean();

    const coupon = await CouponModel.find({ status: "ACTIVE" }).sort({ updatedAt: -1 }).select('-description -expiry_date -status').limit(8).populate('store', 'name cashback_type cashback_rate store_link store_img').populate('category', 'name').lean();

    const category = await CategoryModel.find({ status: "ACTIVE" }).select('-status -description').lean();

    const blog = await BlogModel.find({ status: "ACTIVE" }).limit(4).select('-short_desc -desc -status  -reading_time -tags -publish_schedule -writer_email -keywords').sort({ updatedAt: -1 }).lean();

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
        live_product: live_product,
        watchlist: watchlist_array,
        notification: notification_array,
        referrals
      },
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
