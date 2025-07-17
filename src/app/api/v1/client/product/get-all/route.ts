import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
import { NextResponse } from "next/server";

// type TSortOrder = Record<string, 1 | -1>;

export async function POST(req: Request) {
  await dbConnect();

  try {

    const requestData = await req.json();


    const {
      page = 1,
      limit = 10,
      title,
      store,
      category,
      product_tags,
      // calculation_mode,
      // user_id,
      // long_poster,
      // main_banner,
      // premium_product,
      // flash_sale,
      // slug_type,
      // product_id,
      // product_status,
      // startDate,
      // endDate
    } = requestData;



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};


    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }
    if (store) filters.store = store;
    if (category) filters.category = category;

    // Product Tags
    if (product_tags?.length) {
      filters.product_tags = { $in: product_tags };
    }

    filters.product_status = 'ACTIVE'


    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch Products with Pagination
    const products = await CampaignModel.find(filters)
      .skip(skip)
      .select('store extrnal_url category offer_price calculated_cashback calculation_mode product_img product_tags actual_price product_slug slug_type title  createdAt updatedAt _id')
      .limit(Number(limit))
      .populate('store', 'name store_type cashback_type cashback_rate store_link store_img')
      .populate('category', 'name slug')
      .sort({ updatedAt: -1 }).lean();

    // Get Total Count
    const total = await CampaignModel.countDocuments(filters);

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: products,
        pagination: { total, page, limit }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error retrieving campaigns:", error);
    const errorMessage = error instanceof Error ? error.message : "Unexpected error occurred";

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to retrieve campaigns",
        error: errorMessage,
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
