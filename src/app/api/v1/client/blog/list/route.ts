import { blog_type } from "@/constant";
import dbConnect from "@/lib/dbConnect";
import BlogCategoryModel from "@/model/BlogCategoryModel";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { page = 1, category = null } = requestData;

    const limit = 10;
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = { status: 'ACTIVE' };

    if (category) {
      filters.blog_category = category;
    }

    let f_blog = null;

    if (page === 1) {
     
      f_blog = await BlogModel.findOne()
        .select(
          '-desc -status -meta_title -meta_description -meta_keywords -canonical_url -og_image -og_title -og_description -twitter_card -schema_markup -reading_time -tags -publish_schedule -keywords'
        )
        .populate('writer_id', 'name email profile')
        .populate('blog_category', 'name slug')
        .sort({ createdAt: -1 }) 
        .lean();

      if (f_blog && !Array.isArray(f_blog) && f_blog._id) {
        filters._id = { $ne: f_blog._id }; 
      }
    }

    const blogs = await BlogModel.find(filters)
      .select(
        '-short_desc -desc -status -meta_title -meta_description -meta_keywords -canonical_url -og_image -og_title -og_description -twitter_card -schema_markup -reading_time -tags -publish_schedule -writer_email -keywords'
      )
      .populate('writer_id', 'name email profile')
      .populate('blog_category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

  
    if (page === 1) {
      const blog_category = await BlogCategoryModel.find({ status: 'ACTIVE' })
        .select('-description -status')
        .lean();

      return NextResponse.json(
        {
          success: true,
          message: "Blog posts fetched successfully.",
          data: {
            blogs,
            f_blog,
            blog_type,
            category: blog_category,
          },
        },
        { status: 200 }
      );
    } else {
    
      return NextResponse.json(
        {
          success: true,
          message: "Blogs fetched successfully.",
          data: {
            blogs,
          },
        },
        { status: 200 }
      );
    }
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
