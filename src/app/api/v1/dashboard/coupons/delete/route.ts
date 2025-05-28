import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";
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

   
    if (!(usertype === "admin" || usertype === "data_editor")) {
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

    const { coupon_id } = await req.json();

    if (!coupon_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const coupon = await CouponModel.findById(coupon_id);

    if (!coupon || coupon.status == 'REMOVED') {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon not found or already deleted." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Soft delete the coupon
    coupon.status = 'REMOVED'
    await coupon.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Coupon soft deleted successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to delete coupon:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to delete coupon.", error: error.message }),
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
