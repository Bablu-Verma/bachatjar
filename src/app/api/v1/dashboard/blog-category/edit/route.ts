import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import BlogCategoryModel from "@/model/BlogCategoryModel";

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

    const requestData = await req.json();

    const { description, slug, imges, status } = requestData;

    // Validate required fields
    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Category slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const category = await BlogCategoryModel.findOne({ slug });
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
// Object to store fields to update
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updatedFields: any = {};

// Only update fields that have a valid value
if (description && description.trim() !== "") updatedFields.description = description;
if (status && ["ACTIVE", "INACTIVE"].includes(status)) updatedFields.status = status;

// Update images if an array of valid image links is provided
if (Array.isArray(imges) && imges.every(img => typeof img === "string" && img.trim() !== "")) {
  updatedFields.imges = imges;
}

Object.assign(category, updatedFields);
await category.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Category updated successfully.",
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
      console.error("Failed to update category:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update category.",
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
