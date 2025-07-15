import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogCategoryModel from "@/model/BlogCategoryModel";
import BlogModel from "@/model/BlogModal";

export async function POST(req: Request) {
  await dbConnect();

  try {

      const { } = await authenticateAndValidateUser(req);
    // Parse request body
    const requestData = await req.json();
    const {
      slug
    } = requestData;

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Slug is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Construct filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { slug };
    
    query.status = 'ACTIVE'

    // Fetch data
    const category_details = await BlogCategoryModel.findOne(query).select('-status').lean();

    if (!category_details || typeof category_details !== 'object' || Array.isArray(category_details)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
     // Fetch related blogs using category ID
     const related_blogs = await BlogModel.find({ blog_category: (category_details as { _id: unknown })._id })
     .select("-short_desc -desc -status  -reading_time -tags -publish_schedule")
     .populate("blog_category", "name slug")
     .sort({ createdAt: -1 }).limit(10)
     .lean();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories details fetched successfully.",
        data:{
          related_blogs,
          category_details: category_details,
        } ,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
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