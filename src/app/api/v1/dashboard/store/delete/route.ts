import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const { slug } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Slug is required to delete the store." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the store by slug
    const store = await StoreModel.findOne({ slug });

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Perform soft delete by updating store_status
    store.store_status = "REMOVED";
    await store.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store removed successfully (soft delete).",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to delete store:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to delete store.", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({ success: false, message: "An unexpected error occurred." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
