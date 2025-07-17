import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {

     const { authenticated, usertype, message } = await authenticateAndValidateUser(req);
    
        if (!authenticated) {
          return new NextResponse(
            JSON.stringify({ success: false, message: message || "User is not authenticated" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
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
    const {
      page = 1,
      limit = 20,
      status ,
      store,
      startDate,
      endDate,
      code,
    } = requestData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (status && status !== "ALL") {
      query.status = status; 
    }

    if (store) {
      query.store = store;
    }

    // ✅ Filter by code (Partial search)
    if (code) {
      query.code = { $regex: code, $options: "i" };
    }

    // ✅ Date range filtering
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // ✅ Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    // ✅ Fetch data with filtering, pagination & sorting (Latest first)
    const coupons = await CouponModel.find(query)
      .populate("store", "name cashback_type cashback_rate store_link store_img") // Fetch store details
      .populate("category", "name slug") // Fetch category details
      .sort({ updatedAt: -1 }) // Latest coupons first
      .skip(skip)
      .limit(pageSize)
      .lean();

    // ✅ Get total count for pagination
    const totalCoupons = await CouponModel.countDocuments(query);
    const totalPages = Math.ceil(totalCoupons / pageSize);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Coupons fetched successfully.",
        data: coupons,
        pagination: {
         
          totalPages,
        
        },
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
