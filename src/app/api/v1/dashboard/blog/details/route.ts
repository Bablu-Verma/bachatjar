import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();

  try {

    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

       if (!authenticated) {
         return NextResponse.json({ success: false, message: message || "User is not authenticated" }, { status: 401 });
       }


       if (!(usertype === "admin" || usertype === "blog_editor")) {
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


    const { slug } = requestData;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Blog slug is required." },
        { status: 400 }
      );
    }


    // Fetch the blog with the applied filter
    const blog = await BlogModel.findOne({slug}).populate("blog_category" , 'name slug')

    if (!blog) {
      return NextResponse.json(
        { success: false, message: "Blog not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog post fetched successfully.",
        data: {
          blog: blog
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);

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
