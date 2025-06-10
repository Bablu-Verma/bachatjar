/* eslint-disable @typescript-eslint/no-explicit-any */
import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
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
      page = 1,
      title,
      store,
      limit = 10,
      product_status,
      startDate,
      endDate
    } = requestData;

    // console.log("requestData", requestData)


    const filters: any = {};


    if (title) {
      filters.title = { $regex: title, $options: "i" };
    }

    if (store) filters.store = store;

    const isTrue = (value: any) => value === true || value === "true";

    if (isTrue(filters.long_poster)) filters.long_poster = { $exists: true, $ne: [] };
    if (isTrue(filters.main_banner)) filters.main_banner = { $exists: true, $ne: [] };
    if (isTrue(filters.premium_product)) filters.premium_product = { $exists: true, $ne: [] };
    if (isTrue(filters.flash_sale)) filters.flash_sale = { $exists: true, $ne: [] };


    
    if (product_status && product_status !== "ALL") {
      filters.product_status = product_status;
    }

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await CampaignModel.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .select('-og_image -og_title -og_description -structured_data -canonical_url -meta_robots -meta_keywords -meta_description -meta_title -t_and_c -description')
      .populate('store', 'name cashback_type cashback_rate store_link store_img')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 }).lean();

    // Get Total Count
    const total = await CampaignModel.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: products,
        pagination: { total, page, limit, totalPages }
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
