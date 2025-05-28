import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogCategoryModel from "@/model/BlogCategoryModel";

export async function DELETE(req: Request) {
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
        return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
      }
    
    const requestData = await req.json();
    const { categoryId } = requestData;

   
    if (!categoryId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Find the category by ID
    const category = await BlogCategoryModel.findById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (category.status === "REMOVED") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Category is already soft removed." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

   
    category.status = 'REMOVED';
    await category.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Successfully. soft removed category",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to delete category:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete category.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
