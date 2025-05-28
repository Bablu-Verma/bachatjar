import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";

import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import StoreModel from "@/model/StoreModel";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, usertype, message } =
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

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const requestData = await req.json();
    const requiredFields = [
      "title",
      "actual_price",
      "store",
      "category",
      "description",
      "product_img",
      "t_and_c",
      "meta_title",
      "meta_description",
      "meta_keywords",
      "product_status",
    ];

    // Validate Required Fields
    for (const field of requiredFields) {
      if (
        !requestData[field] ||
        (Array.isArray(requestData[field]) && requestData[field].length === 0)
      ) {
        return new NextResponse(
          JSON.stringify({ success: false, message: `${field} is required.` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const {
      title,
      actual_price,
      store,
      category,
      description,
      product_img,
      t_and_c,
      meta_title,
      meta_description,
      meta_keywords,
      product_status,
      product_tags,
      long_poster,
      main_banner,
      premium_product,
      flash_sale,
      slug_type,
      meta_robots,
      canonical_url,
      structured_data,
      og_image,
      og_title,
      og_description,
    } = requestData;

    // Validate Slug Uniqueness
    const slug = generateSlug(title);

    const existingProduct = await CampaignModel.findOne({ product_slug: slug });

    if (existingProduct) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product with this title already exists.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (premium_product === true) {
      const premiumCount = await CampaignModel.countDocuments({
        premium_product: true,
      });
      if (premiumCount >= 4) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "You can only add up to 4 premium products.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const getStroe = await StoreModel.findById(store).select('_id cashback_rate cashback_type')

    // Validate Number Fields
    const actualPriceNum = Number(actual_price);
    const cashbackNum = Number(getStroe.cashback_rate);

    // Ensure both values are valid numbers
    if (isNaN(actualPriceNum) || actualPriceNum < 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid actual_price. Must be a positive number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (isNaN(cashbackNum) || cashbackNum < 0) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid cashback_. Must be a non-negative number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Calculate cashback and offer price
    let calculated_cashback_ = 0;
    let offer_price_ = actualPriceNum;

    if (getStroe.cashback_type === "FLAT_AMOUNT") {
      calculated_cashback_ = cashbackNum;
    } else if (getStroe.cashback_type === "PERCENTAGE") {
      calculated_cashback_ = (actualPriceNum * cashbackNum) / 100;
    }

    // Ensure offer price does not go negative
    offer_price_ = Math.max(0, actualPriceNum - calculated_cashback_);

    // Create New Campaign
    const newCampaign = new CampaignModel({
      title,
      actual_price,
      offer_price: offer_price_,
      calculated_cashback: calculated_cashback_,
      user_id: user?._id,
      store,
      category,
      description,
      product_img,
      product_tags,
      long_poster,
      main_banner,
      premium_product,
      flash_sale,
      t_and_c,
      product_slug: slug,
      slug_type,
      meta_title,
      meta_description,
      meta_keywords,
      meta_robots,
      canonical_url,
      structured_data,
      og_image,
      og_title,
      og_description,
      product_status,
    });

    await newCampaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign added successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to create campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to create campaign",
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
          message: "An unexpected error occurred",
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
