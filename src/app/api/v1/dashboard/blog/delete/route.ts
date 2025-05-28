import { authenticateAndValidateUser } from "@/lib/authenticate";
import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { NextResponse } from "next/server";

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
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
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

    const { slug } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Slug is required to delete the blog.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Attempt to delete the blog post with the given slug
    const blog_ = await BlogModel.findOne({ slug });

    if (!blog_) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: `No blog found with slug: ${slug}`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    blog_.status = 'REMOVED'

    await blog_.save()

    // Return success response
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Blog with slug "${slug}" soft deleted successfully.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);

    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while deleting the blog.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
