import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import StoreModel from "@/model/StoreModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json({ success: false, message: message || "User is not authenticated" }, { status: 401 });
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
    }

    const requestData = await req.json();

    if (!requestData._id) {
      return NextResponse.json({ success: false, message: "_id is required to update campaign." }, { status: 400 });
    }

    // Step 1: Fetch current campaign
    const currentCampaign = await CampaignModel.findById(requestData._id);
    if (!currentCampaign) {
      return NextResponse.json({ success: false, message: "Campaign not found." }, { status: 404 });
    }

    // Step 2: Basic required fields check
    const requiredFields = ["title", "actual_price", "store", "category", "product_img", "product_status"];
    for (const field of requiredFields) {
      const val = requestData[field];
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
        return NextResponse.json({ success: false, message: `${field} is required.` }, { status: 400 });
      }
    }

    // Step 3: Check if store changed and fetch store accordingly
    const storeChanged = currentCampaign.store._id.toString() !== requestData.store;
    let storeDoc;

    if (storeChanged) {
      // If store is being changed, fetch the new store details
      storeDoc = await StoreModel.findById(requestData.store).select("cashback_rate cashback_type store_type slug name store_link");
      if (!storeDoc) {
        return NextResponse.json({ success: false, message: "Store not found." }, { status: 404 });
      }
    } else {
      // If store is not being changed, fetch the current store details from database
      storeDoc = await StoreModel.findById(currentCampaign.store._id).select("cashback_rate cashback_type store_type slug name store_link");
      if (!storeDoc) {
        return NextResponse.json({ success: false, message: "Current store not found in database." }, { status: 404 });
      }
    }

    // Step 4: Store-based field validations
    if (storeDoc.store_type !== "NON_INSENTIVE") {
      const extraFields = ["description", "t_and_c"];
      for (const field of extraFields) {
        const val = requestData[field];
        if (val === undefined || val === null || (typeof val === "string" && val.trim() === "") || (Array.isArray(val) && val.length === 0)) {
          return NextResponse.json({ success: false, message: `${field} is required for this store type.` }, { status: 400 });
        }
      }
    }

    // For NON_INSENTIVE stores, always validate offer_price
    if (storeDoc.store_type === "NON_INSENTIVE") {
      if (requestData.offer_price === undefined || requestData.offer_price === null || isNaN(Number(requestData.offer_price))) {
        return NextResponse.json({ success: false, message: "offer_price is required for NON_INSENTIVE store." }, { status: 400 });
      }
      if (!requestData.extrnal_url) {
        return NextResponse.json({ success: false, message: "extrnal_url is required for NON_INSENTIVE store." }, { status: 400 });
      }
    }
    // Step 5: Title/Slug check
    let slug = currentCampaign.product_slug;
    if (requestData.title !== currentCampaign.title) {
      slug = generateSlug(requestData.title);
      const existingProduct = await CampaignModel.findOne({
        product_slug: slug,
        _id: { $ne: requestData._id }
      });
      if (existingProduct) {
        return NextResponse.json({ success: false, message: "Another product with this title already exists." }, { status: 400 });
      }
    }

    // Step 1: Parse and validate input
    const actualPrice = Number(requestData.actual_price);
    const inputOfferPrice = Number(requestData.offer_price);
    const cashbackRate = Number(storeDoc.cashback_rate);
    const cashbackType = storeDoc.cashback_type;
    const storeType = storeDoc.store_type;

    if (isNaN(actualPrice) || actualPrice < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid actual_price. Must be a positive number." },
        { status: 400 }
      );
    }

    if (isNaN(cashbackRate) || cashbackRate < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid cashback_rate. Must be a non-negative number." },
        { status: 400 }
      );
    }

    let calculatedCashback = 0;
    let offerPrice = 0;

    // Step 2: Calculate based on store type
    if (storeType === "NON_INSENTIVE") {
      // Offer price must come from the frontend for NON_INSENTIVE stores
      if (isNaN(inputOfferPrice) || inputOfferPrice < 0) {
        return NextResponse.json(
          { success: false, message: "Invalid offer_price. Must be a positive number." },
          { status: 400 }
        );
      }

      offerPrice = inputOfferPrice;
      calculatedCashback = Math.max(0, actualPrice - offerPrice);
    } else {
      // For INSENTIVE stores, calculate cashback and derive offer price
      if (cashbackType === "FLAT_AMOUNT") {
        if (cashbackRate > actualPrice) {
          return NextResponse.json(
            { success: false, message: "Cashback cannot exceed actual price." },
            { status: 400 }
          );
        }
        calculatedCashback = cashbackRate;
      } else if (cashbackType === "PERCENTAGE") {
        calculatedCashback = (actualPrice * cashbackRate) / 100;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid cashback_type. Must be FLAT_AMOUNT or PERCENTAGE." },
          { status: 400 }
        );
      }

      offerPrice = Math.max(0, actualPrice - calculatedCashback);
    }

    const updatedCampaign = await CampaignModel.findByIdAndUpdate(
      requestData._id,
      {
        title: requestData.title,
        actual_price: actualPrice,
        offer_price: offerPrice,
        calculated_cashback: calculatedCashback,
        store: storeDoc._id,
        category: requestData.category,
        description: requestData.description,
        product_img: requestData.product_img,
        product_tags: requestData.product_tags || [],
        long_poster: requestData.long_poster || "",
        main_banner: requestData.main_banner || "",
        premium_product: requestData.premium_product || false,
        flash_sale: requestData.flash_sale || false,
        t_and_c: requestData.t_and_c,
        product_slug: slug,
        extrnal_url: requestData.extrnal_url,
        slug_type: requestData.slug_type || "custom",
        meta_title: requestData.meta_title,
        meta_description: requestData.meta_description,
        meta_keywords: requestData.meta_keywords,
        meta_robots: requestData.meta_robots || "",
        canonical_url: requestData.canonical_url || "",
        structured_data: requestData.structured_data || "",
        og_image: requestData.og_image || "",
        og_title: requestData.og_title || "",
        og_description: requestData.og_description || "",
        product_status: requestData.product_status,
      },
      { new: true }
    );

    if (!updatedCampaign) {
      return NextResponse.json({ success: false, message: "Campaign not found after update." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Campaign updated successfully." }, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to update campaign:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update campaign",
        error: error instanceof Error ? error.message : "Unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}