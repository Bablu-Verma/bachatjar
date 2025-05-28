import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponTrackingModel from "@/model/CouponCodeTracking";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CouponModel from "@/model/CouponModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Try to authenticate, but don't force
    const { user } = await authenticateAndValidateUser(req);

    const body = await req.json();
    const { coupon_id, ip_address, user_agent } = body;

    if (!coupon_id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required." },
        { status: 400 }
      );
    }

    const coupon = await CouponModel.findById(coupon_id).select("code store _id status");

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Coupon not found." },
        { status: 404 }
      );
    }

    if (coupon.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: "Coupon is not active. Please do not use." },
        { status: 400 }
      );
    }

    const newCouponTracking = new CouponTrackingModel({
      coupon_code: coupon.code,
      coupon_id: coupon._id,
      store_id: coupon.store,
      copied_at: new Date(),
      user_id: user?._id, 
      ip_address,
      user_agent,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const savedTracking = await newCouponTracking.save();

    return NextResponse.json(
      { success: true, message: "Coupon tracking saved successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving coupon tracking:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while saving coupon tracking.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
