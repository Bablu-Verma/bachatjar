import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

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

    const requestData = await req.json();
    const { name, status, startDate, endDate, page = 1, limit = 20 } = requestData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    
    if (status && ["ACTIVE", "INACTIVE", "REMOVED"].includes(status)) {
      query.status = status;
    } else {
      query.status = { $in: ["ACTIVE", "INACTIVE", "REMOVED"] };
    }

    // Date Filter
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

   

    // Pagination
    const skip = (page - 1) * limit;
    const categories = await BlogCategoryModel.find(query).skip(skip).limit(limit);
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
