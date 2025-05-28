import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { name, page = 1, limit = 10 } = requestData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};


    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    query.status = 'ACTIVE'

    // Pagination
    const skip = (page - 1) * limit;
    const categories = await BlogCategoryModel.find(query).select('-description -status').skip(skip).limit(limit).lean();
    const totalCategories = await BlogCategoryModel.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories fetched successfully.",
        data: categories,
        pagination: {
          currentPage: page,
          totalPages,
          totalCategories,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to fetch categories:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch categories.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
