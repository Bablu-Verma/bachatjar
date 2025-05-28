import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Extract Query Parameters
    const { page = 1 } = await req.json();

    const limit = 2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    query.store_status = "ACTIVE";

    // Pagination Setup
    const pageNumber = parseInt(page);
    
    const skip = (pageNumber - 1) * limit;

 

    // Fetch Stores with Filtering, Pagination & Sorting
    const stores = await StoreModel.find(query)
      .skip(skip)
      .select('-description -store_status -tc -tracking')
      .limit(limit)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store list fetched successfully.",
        data: stores,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Failed to fetch store list:", errorMsg);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch store list.",
        error: errorMsg,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
