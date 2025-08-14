import { generateSlug } from "@/helpers/client/client_function";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import StoreModel from "@/model/StoreModel";
import { amazonScrape } from "@/scraper/amazon";
import { NextResponse } from "next/server";

export async function POST() {
  await dbConnect();

  try {
    const deals = await amazonScrape(); 

    if (!Array.isArray(deals) || deals.length === 0) {
      return NextResponse.json({ success: false, message: "No deals to process." }, { status: 400 });
    }

    const results = {
      inserted: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const deal of deals) {
      try {
        const {
          title, actual_price, offer_price, url,
          store, category, image, user_id
        } = deal;

      
        const storeDoc = await StoreModel.findById(store).select("cashback_rate store_type");
        if (!storeDoc || storeDoc.store_type !== "NON_INSENTIVE") {
          results.skipped++;
          results.errors.push(`Invalid or unsupported store for: ${title}`);
          continue;
        }

        const actual = Number(actual_price);
        const offer = Number(offer_price);

        if (isNaN(actual) || isNaN(offer) || offer > actual) {
          results.skipped++;
          results.errors.push(`Invalid pricing for: ${title}`);
          continue;
        }

        const product_slug = generateSlug(title);
        const duplicate = await CampaignModel.findOne({ product_slug });

        if (duplicate) {
          results.skipped++;
          results.errors.push(`Duplicate found for: ${title}`);
          continue;
        }

        const cashback = actual - offer;

        const newDeal = new CampaignModel({
          title,
          actual_price: actual,
          offer_price: offer,
          calculated_cashback: cashback,
          user_id,
          store: storeDoc._id,
          category,
          product_img: image,
          description: "N/A", 
          t_and_c: "N/A",
          product_status: "ACTIVE",
          product_slug,
          slug_type:'EXTERNAL',
          extrnal_url: url,
          product_tags:['live']
        });

        await newDeal.save();
        results.inserted++;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        results.skipped++;
        results.errors.push(`Error saving deal: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Deals processed.",
      ...results,
    });
    
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error in scraper API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal error during scraping",
        error: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
