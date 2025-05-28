import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import OrderModel from "@/model/OrderModel";


export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, usertype, message } = await authenticateAndValidateUser(
      req
    );
    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { orderId } = await req.json();

    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Order ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch order details
    const order = await OrderModel.findById(orderId)
      .populate('user_id', 'name email')
      .populate('store_id', 'name slug')
      .lean()
      .exec();
      
    if (!order) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Order not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Order details fetched",
        order,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch order details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to fetch order details.",
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
