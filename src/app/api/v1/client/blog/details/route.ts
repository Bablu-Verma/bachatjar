import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const requestData = await req.json();
    const { slug } = requestData;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Blog slug is required." },
        { status: 400 }
      );
    }

    // Define the filter object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { slug };
    filter.status = "ACTIVE";

    // Fetch the blog with the applied filter
    const blog = await BlogModel.findOne(filter)
      .select('-status')
      .populate("writer_id", "name email profile")
      .populate("");

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found." },
        { status: 404 }
      );
    }

    blog.views = +1;

    await blog.save();

    const relatedBlogs = await BlogModel.find({
      blog_category: blog.blog_category._id,
      _id: { $ne: blog._id },
    })
      .select('-short_desc -desc -status -meta_title -meta_description -meta_keywords -canonical_url -og_image -og_title -og_description -twitter_card -schema_markup -reading_time -tags -publish_schedule -writer_email -keywords')
      .populate("writer_id", "name email profile")
      .populate("blog_category", "name slug")
      .limit(5)
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Blog post fetched successfully.",
        data: {
          blog: blog,
          relatedblogs: relatedBlogs,
        },
      },
      { status: 200 }
    );
  } catch (error) {


    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching blog post.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
