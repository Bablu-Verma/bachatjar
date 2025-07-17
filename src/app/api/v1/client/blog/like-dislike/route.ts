import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/BlogModal";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import mongoose from "mongoose";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, user, message } =
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

    // Parse request data
    const { blog_id, action } = await req.json();

    if (!blog_id || !action || !["like", "dislike"].includes(action)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid blog_id or action (must be 'like' or 'dislike').",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(blog_id)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Invalid blog ID.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const blog = await BlogModel.findById(blog_id).select('liked_by disliked_by');
    if (!blog) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Blog not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(user?._id);

    if (action === "like") {
      const alreadyLiked = blog.liked_by.includes(userObjectId);
      if (alreadyLiked) {
        blog.liked_by.pull(userObjectId); 
      } else {
        blog.liked_by.push(userObjectId); 
        blog.disliked_by.pull(userObjectId); 
      }
    } else if (action === "dislike") {
      const alreadyDisliked = blog.disliked_by.includes(userObjectId);
      if (alreadyDisliked) {
        blog.disliked_by.pull(userObjectId); 
      } else {
        blog.disliked_by.push(userObjectId); 
        blog.liked_by.pull(userObjectId); 
      }
    }

    await blog.save();

    const check_action:string = blog.liked_by.some(
      (id:mongoose.Types.ObjectId) => id.toString() === userObjectId.toString()
    ) ? 'LIKE': blog.disliked_by.some(
      (id:mongoose.Types.ObjectId) => id.toString() === userObjectId.toString()
    )?'DISLIKE':'NO_ACTION'

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Blog ${action}d successfully.`,
        data: {
          likes: blog.liked_by.length,
          dislikes: blog.disliked_by.length,
          action:check_action
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error toggling blog like/dislike:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update blog reaction.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
