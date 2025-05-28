import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CouponModel from "@/model/CouponModel";
import StoreModel from "@/model/StoreModel";
import CategoryModel from "@/model/CategoryModel";
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

    const requestData = await req.json();

   

    const { coupon_id, code, discount, title, description, expiry_date, store, category, status } = requestData;

    

    if (!coupon_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon ID is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const coupon = await CouponModel.findById(coupon_id);
    if (!coupon || coupon.deleted_coupon) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Coupon not found or has been deleted." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Optional: Validate store & category if updated
    if (store) {
      const storeExists = await StoreModel.findById(store);
      if (!storeExists) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Store not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (category) {
      const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) {
        return new NextResponse(
          JSON.stringify({ success: false, message: "Category not found." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Update coupon fields if provided
    if (code) coupon.code = code;
    if (title) coupon.title = title;
    if (discount) coupon.discount = discount;
    if (description) coupon.description = description;
    if (expiry_date) coupon.expiry_date = expiry_date;
    if (store) coupon.store = store;
    if (category) coupon.category = category;
    if (status !== undefined) coupon.status = status;

    await coupon.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Coupon updated successfully."}),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to edit coupon:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to edit coupon.", error: error.message }),
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
