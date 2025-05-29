import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import mongoose from "mongoose";



export async function POST(req: Request) {
  await dbConnect();

  try {
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

    const { product_id } = await req.json();

    if (!product_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find the user's wishlist
    const wishlist = await WishlistModel.findOne({ user_id });

    if (!wishlist || !wishlist.campaigns.includes(product_id)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign not found in the wishlist.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    wishlist.campaigns = wishlist.campaigns.filter(
      (id: mongoose.Types.ObjectId | string) =>
        id.toString() !== product_id.toString()
    );

    await wishlist.save();
    // console.log('Campaign removed from wishlist successfully.')
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign removed from wishlist successfully.",
        data: wishlist,
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
      console.error("Failed to remove from wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to remove from wishlist.",
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
