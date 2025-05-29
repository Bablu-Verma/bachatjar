/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import StoreModel from "@/model/StoreModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const {
      product_id,
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

    if (!product_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid request data. product_id is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const campaign = await CampaignModel.findOne({ _id:product_id });

    if (!campaign) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Product not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (title) {
      const newSlug = generateSlug(title);
      if (newSlug !== campaign.product_slug) {
        const existingCampaign = await CampaignModel.findOne({
          product_slug: newSlug,
        });
        if (existingCampaign) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: `The slug "${newSlug}" is already in use. Please use a different product name.`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
        campaign.product_slug = newSlug;
      }
    }

    if (description && description.length < 20) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Description must be at least 100 characters long.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }


    const getStroe = await StoreModel.findById(store).select('_id cashback_rate cashback_type')
    // console.log("getStroe",getStroe)

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

    const updateIfValid = (field: string, value: any) => {
      if (value !== undefined && value !== null && value !== "") {
        campaign[field] = value;
      }
    };

    // Handle normal fields
    updateIfValid("title", title);
    updateIfValid("store", store);
    updateIfValid("category", category);
    updateIfValid("t_and_c", t_and_c);
    updateIfValid("meta_title", meta_title);
    updateIfValid("meta_description", meta_description);
    updateIfValid("meta_robots", meta_robots);
    updateIfValid("canonical_url", canonical_url);
    updateIfValid("structured_data", structured_data);
    updateIfValid("og_image", og_image);
    updateIfValid("og_title", og_title);
    updateIfValid("structured_data", structured_data);
    updateIfValid("og_description", og_description);
    updateIfValid("product_img", product_img);
    updateIfValid(
      "meta_keywords",
      Array.isArray(meta_keywords) ? meta_keywords : undefined
    );
    updateIfValid("actual_price", actual_price);
    updateIfValid("calculated_cashback", calculated_cashback_);
    updateIfValid("offer_price", offer_price_);

  
    
    if (slug_type && ["INTERNAL", "EXTERNAL"].includes(slug_type)) {
      campaign.slug_type = slug_type;
    }
    if (product_status && ["ACTIVE", "PAUSE"].includes(product_status)) {
      campaign.product_status = product_status;
    }

    if (Array.isArray(product_tags)) {
      campaign.product_tags = product_tags;
    }
    
    const validateImageArray = (value: any) =>
      Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === "object" &&
          (!item.is_active || (item.image && typeof item.image === "string"))
      );

    if (validateImageArray(long_poster)) {
      campaign.long_poster = long_poster;
    }
    if (validateImageArray(main_banner)) {
      campaign.main_banner = main_banner;
    }
    if (validateImageArray(premium_product)) {
      campaign.premium_product = premium_product;
    }
    if (
      Array.isArray(flash_sale) &&
      flash_sale.every(
        (item) =>
          typeof item === "object" &&
          (!item.is_active || (item.image && item.end_time))
      )
    ) {
      campaign.flash_sale = flash_sale;
    }

    await campaign.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign edited successfully.",
     
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to edit campaign:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to edit campaign.",
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
