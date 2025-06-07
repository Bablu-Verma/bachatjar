import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import StoreModel from "@/model/StoreModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json({ success: false, message: message || "User is not authenticated" }, { status: 401 });
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
    }

    const requestData = await req.json();

    // Step 1: Required fields
    const requiredFields = ["title", "actual_price", "store", "category", "product_img", "product_status"];
    for (const field of requiredFields) {
      const val = requestData[field];
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
        return NextResponse.json({ success: false, message: `${field} is required.` }, { status: 400 });
      }
    }

    // Step 2: Fetch Store
    const storeDoc = await StoreModel.findById(requestData.store).select("cashback_rate cashback_type store_type slug name store_link");
    if (!storeDoc) {
      return NextResponse.json({ success: false, message: "Store not found." }, { status: 404 });
    }

    // Step 3: Extra validations for incentive-based stores
    if (storeDoc.store_type !== "NON_INSENTIVE") {
      const extraFields = ["description", "t_and_c", "meta_title", "meta_description", "meta_keywords"];
      for (const field of extraFields) {
        const val = requestData[field];
        if (val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
          return NextResponse.json({ success: false, message: `${field} is required.` }, { status: 400 });
        }
      }
    }

    // Step 4: Validation for NON_INSENTIVE offer_price
    if (storeDoc.store_type === "NON_INSENTIVE") {
      if (requestData.offer_price === undefined || requestData.offer_price === null || isNaN(Number(requestData.offer_price))) {
        return NextResponse.json({ success: false, message: "offer_price is required for NON_INSENTIVE store." }, { status: 400 });
      }
    }

    // Step 5: Slug check
    const slug = generateSlug(requestData.title);
    const existingProduct = await CampaignModel.findOne({ product_slug: slug });
    if (existingProduct) {
      return NextResponse.json({ success: false, message: "Product with this title already exists." }, { status: 400 });
    }

    // Step 6: Price calculations
    const actualPrice = Number(requestData.actual_price);
    const cashbackRate = Number(storeDoc.cashback_rate);

    if (isNaN(actualPrice) || actualPrice < 0) {
      return NextResponse.json({ success: false, message: "Invalid actual_price. Must be a positive number." }, { status: 400 });
    }

    if (isNaN(cashbackRate) || cashbackRate < 0) {
      return NextResponse.json({ success: false, message: "Invalid cashback rate. Must be a non-negative number." }, { status: 400 });
    }

    let calculatedCashback = 0;
    if (storeDoc.cashback_type === "FLAT_AMOUNT") {
      calculatedCashback = cashbackRate;
    } else if (storeDoc.cashback_type === "PERCENTAGE") {
      calculatedCashback = (actualPrice * cashbackRate) / 100;
    }

    let offerPrice = 0;
    if (storeDoc.store_type === "NON_INSENTIVE") {
      offerPrice = Number(requestData.offer_price);
    } else {
      offerPrice = Math.max(0, actualPrice - calculatedCashback);
    }

    // Step 7: Create new campaign
    const storeForCampaign = {
      _id: storeDoc._id.toString(),
      slug: storeDoc.slug,
      name: storeDoc.name,
      store_link:storeDoc.store_link
    };

    const newCampaign = new CampaignModel({
      title: requestData.title,
      actual_price: actualPrice,
      offer_price: offerPrice,
      calculated_cashback: calculatedCashback,
      user_id: user?._id,
      store: storeForCampaign,
      category: requestData.category,
      description: requestData.description,
      product_img: requestData.product_img,
      product_tags: requestData.product_tags,
      long_poster: requestData.long_poster,
      main_banner: requestData.main_banner,
      premium_product: requestData.premium_product,
      flash_sale: requestData.flash_sale,
      t_and_c: requestData.t_and_c,
      product_slug: slug,
      slug_type: requestData.slug_type,
      meta_title: requestData.meta_title,
      meta_description: requestData.meta_description,
      meta_keywords: requestData.meta_keywords,
      meta_robots: requestData.meta_robots,
      canonical_url: requestData.canonical_url,
      structured_data: requestData.structured_data,
      og_image: requestData.og_image,
      og_title: requestData.og_title,
      og_description: requestData.og_description,
      product_status: requestData.product_status,
    });

    await newCampaign.save();

    return NextResponse.json({ success: true, message: "Campaign added successfully" }, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create campaign:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create campaign",
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
