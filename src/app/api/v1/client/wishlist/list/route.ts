import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";

import CampaignModel from "@/model/CampaignModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
    const { authenticated, user, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const user_id = user?._id;

    const watchlist = await WishlistModel.findOne({ user_id });

    if (
      !watchlist ||
      !watchlist.campaigns ||
      watchlist.campaigns.length === 0
    ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          data: {
            count: 0,
            products: [],
          },
          message: "No products found in the watchlist.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Fetch product details from the CampaignModel
    const products = await CampaignModel.find({
      _id: { $in: watchlist.campaigns },
    }).select('store category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id').populate('category', "name slug").populate('store', 'name slug cashback_type cashback_rate store_link store_img').lean();

    if (!products || products.length === 0) {
      return new NextResponse(
        JSON.stringify({
          data: {
            count: 0,
            products: [],
          },
          success: false,

          message: "No product details found for the given watchlist.",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Respond with products, count, and Wishlist ID
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Watchlist retrieved successfully.",
        data: {
          wishlist_id: watchlist._id,
          products, 
          count: products.length, 
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
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve watchlist.",
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
