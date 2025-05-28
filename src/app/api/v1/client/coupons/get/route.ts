import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Extract filter and pagination parameters
    const requestData = await req.json();
    const {
      page = 1,
    } = requestData;

    const limit = 2

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};


    query.status ='ACTIVE'



    // ✅ Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const skip = (pageNumber - 1) * limit;

    // ✅ Fetch data with filtering, pagination & sorting (Latest first)
    const coupons = await CouponModel.find(query).select('-description -expiry_date -status')
      .populate("store", "name cashback_type cashback_rate store_link store_img") 
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit)
      .lean();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Coupons fetched successfully.",
        data: coupons,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch coupons:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch coupons.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
