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
    const { code, title, discount, description, expiry_date, store, category, status } = requestData;

    if (!code || !discount ||! title || !description || !expiry_date || !store || !category) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "All fields are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const existingCoupon = await CouponModel.findOne({ code });
    if (existingCoupon) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "A coupon with this code already exists." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const storeExists = await StoreModel.findById(store);
    if (!storeExists) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Category not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const newCoupon = new CouponModel({
      code,
      discount,
      description,
      expiry_date,
      store,
      category,
      title,
      status,
    });

    await newCoupon.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Coupon added successfully."}),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add coupon:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to add coupon.", error: error.message }),
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
