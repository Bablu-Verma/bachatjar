import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";



// API Handler
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
    if (!(usertype === "admin" || usertype === "blog_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
 const {status,sortBy, search,endDate,startDate,page = 1, limit = 20}  = requestData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortOptions: any = { createdAt: -1 };
  
    if (status && status !== "ALL") {
      if (!["ACTIVE", "INACTIVE", "REMOVED"].includes(status)) {
        throw new Error("Invalid status value.");
      }
      filters.status = status;
    }
  
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }
  
    // Filtering by date range
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filters.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filters.createdAt = { $lte: new Date(endDate) };
    }
  
    if (sortBy === "views") {
      sortOptions.views = -1; // Sort by most viewed
    } else if (sortBy === "createdAt") {
      sortOptions.createdAt = -1; // Sort by newest first
    }
    const skip = (page - 1) * limit;
   
    // Fetch blogs with filters, sorting, and pagination
    const blogs = await BlogModel.find(filters)
      .populate("writer_id", "name email profile")
      .populate("blog_category", 'name slug')
      .lean()
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalBlogs = await BlogModel.countDocuments(filters);

   
    return NextResponse.json(
      {
        success: true,
        message: "Blog posts fetched successfully.",
        data: blogs,
        pagination: {
          page,
          limit,
          totalPages: Math.ceil(totalBlogs / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching blog posts.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
