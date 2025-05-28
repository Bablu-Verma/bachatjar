import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";

import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Step 1: Authenticate the user
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    
    if (!(usertype === "admin" || usertype === "data_editor")) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Step 3: Parse request body
    const { slug } = await req.json();

    if (!slug || typeof slug !== "string") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "A valid slug is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 4: Query the store
    const store = await StoreModel.findOne({ slug }).populate("category", "name slug");

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 5: Respond with store data
    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store fetched successfully.",
        data: { store },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch store details.",
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
