import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogCategoryModel, { IBCategory } from "@/model/BlogCategoryModel";


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
      return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
    }
 
     const { name, description, imges, status }: IBCategory = await req.json();

     
     if (!name || !description || !imges || !Array.isArray(imges)) {
       return new NextResponse(
         JSON.stringify({ success: false, message: "All fields are required and 'imges' must be an array." }),
         { status: 400, headers: { "Content-Type": "application/json" } }
       );
     }

    const slug = generateSlug(name)
 
    const existingCategory = await BlogCategoryModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "A category with this name or slug already exists.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Create a new category
    const newCategory = new BlogCategoryModel({
      name,
      description,
      slug,
      imges,
      status,
    });

  
    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Category added successfully."
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add category:", error.message);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Failed to add category.",
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
