import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {

      const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

   
       if (!authenticated) {
         return new NextResponse(
           JSON.stringify({
             success: false,
             message: message || "User is not authenticated",
           }),
           {
             status: 401,
             headers: {
               "Content-Type": "application/json",
             },
           }
         );
       }
   
    
       if (!(usertype === "admin" || usertype === "blog_editor")) {
        return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
      }

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

    // Fetch data
    const category_details = await BlogCategoryModel.findOne({slug})

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Categories details fetched successfully.",
        data: category_details,
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