import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";


export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, user, usertype, message } = await authenticateAndValidateUser(req);
    if (!authenticated) {
      return NextResponse.json({ success: false, message: message || "User is not authenticated" }, { status: 401 });
    }

    if (!(usertype === "admin" || usertype === "blog_editor")) {
      return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
    }

    // Parse request data
    const requestData = await req.json();
    const {
      title,
      short_desc,
      desc,
      blog_category,
      blog_type,
      image,
      tags,
      reading_time,
      keywords,
      publish_schedule,
      status,
      meta_title,
      meta_description,
      meta_keywords,
      canonical_url,
      og_image,
      og_title,
      og_description,
      twitter_card,
      schema_markup,
    } = requestData;

    // Validation
    if (!title || title.length < 5 || title.length > 150) {
      return NextResponse.json({ success: false, message: "Title must be between 5 and 150 characters." }, { status: 400 });
    }
    if (!blog_category) {
      return NextResponse.json({ success: false, message: "Category id is required" }, { status: 400 });
    }
    if (!short_desc || short_desc.length < 10) {
      return NextResponse.json({ success: false, message: "Short description must be at least 10 characters." }, { status: 400 });
    }
    if (!desc || desc.length < 20) {
      return NextResponse.json({ success: false, message: "Description must be at least 20 characters." }, { status: 400 });
    }
    if (!Array.isArray(image) || image.length < 1) {
      return NextResponse.json({ success: false, message: "At least one image is required." }, { status: 400 });
    }
    if (publish_schedule && isNaN(Date.parse(publish_schedule))) {
      return NextResponse.json({ success: false, message: "Invalid publish schedule date." }, { status: 400 });
    }
   
    if (status && !["ACTIVE", "INACTIVE", "REMOVED"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status value." }, { status: 400 });
    }
 

    // Generate unique slug
    const slug = generateSlug(title);
    const existingBlog = await BlogModel.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json({ success: false, message: "A blog with this slug already exists." }, { status: 400 });
    }

    const parsedTags = Array.isArray(tags) ? tags.map((item) => item.trim()) : [];
     const parsedMetaKeywords = Array.isArray(meta_keywords) ? meta_keywords.map((item) => item.trim()) : [];
  

    // Create new blog entry
    const newBlog = new BlogModel({
      title,
      slug,
      short_desc,
      desc,
      blog_category,
      blog_type,
      image,
      tags: parsedTags,
      writer_id:user?._id,
      reading_time,
      keywords,
      publish_schedule,
      status,
      meta_title,
      meta_description,
      meta_keywords: parsedMetaKeywords,
      canonical_url,
      og_image,
      og_title,
      og_description,
      twitter_card,
      schema_markup,
      views: 0, // Default value for views
    });

    // Save to database
    await newBlog.save();

    return NextResponse.json({ success: true, message: "Blog created successfully." }, { status: 201 });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating blog:", error.message);
      return NextResponse.json({ success: false, message: "Failed to add blog.", error: error.message }, { status: 500 });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({ success: false, message: "An unexpected error occurred." }, { status: 500 });
    }
  }
}
