import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import "@/model/StoreModel";
import "@/model/CategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const { 
    page = 1, 
    tag = "all", 
    sortPrice = "",   // "low" | "high"
    sortDate = "latest", // "latest" | "oldest"
    categoryid = null,    // 🔥 new
    storeid = null       // 🔥 new
  } = body;

  const offerDealLimit = 30;
  const skip_offer = (page - 1) * offerDealLimit;

  try {
    // ---------------- FILTER ----------------
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {
      product_status: "ACTIVE",
    };

    if (tag =='hot' || tag == 'live') {
      filter.product_tags = tag;
    }
    
    if(tag=='free'){
      filter.offer_price == 0
    }

    if (categoryid) {
      filter.category = categoryid;
    }

    if (storeid) {
      filter.store = storeid;
    }


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortQuery: any = {};

    // Price Sorting
    if (sortPrice === "low") {
      sortQuery.offer_price = 1;
    } else if (sortPrice === "high") {
      sortQuery.offer_price = -1;
    }
    
    // Date Sorting
    if (sortDate === "latest") {
      sortQuery.updatedAt = -1;
    } else if (sortDate === "oldest") {
      sortQuery.updatedAt = 1;
    }
    

    // ---------------- QUERY ----------------
    const offer_deal = await CampaignModel.find(filter)
      .skip(skip_offer)
      .limit(offerDealLimit)
      .sort(sortQuery)
      .populate("store", "name cashback_type cashback_rate store_link store_type store_img")
      .populate("category", "name slug")
      .select(
        "store extrnal_url category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title createdAt updatedAt _id"
      )
      .lean();

    return NextResponse.json({
      success: true,
      message: "Deal data fetched successfully.",
      data: offer_deal,
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
