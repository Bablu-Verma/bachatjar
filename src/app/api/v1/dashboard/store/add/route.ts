import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CategoryModel from "@/model/CategoryModel";

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
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: Requires admin role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const {
      name,
      description,
      store_img,
      category,
      tc,
      tracking,
      cashback_status,
      store_link,
      cashback_type,
      cashback_rate,
      store_status,
      upto_amount,
      claim_form
    } = requestData;

    if (
      !name ||
      !description ||
      !store_img ||
      !store_link ||
      !cashback_type ||
      cashback_rate == null ||
      !category ||
      !tc ||
      !tracking
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    


    const parsedCashbackRate = Number(cashback_rate);
    if (isNaN(parsedCashbackRate)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Cashback rate must be a number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }



    const trimmedName = name.trim();
    const trimmedSlug = generateSlug(trimmedName);

    const existingStore = await StoreModel.findOne({
      $or: [{ name: trimmedName }, { slug: trimmedSlug }],
    });

    if (existingStore) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Store with this name or slug already exists.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Invalid category ID." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newStore = new StoreModel({
      name: trimmedName,
      category,
      upto_amount: upto_amount !== undefined && upto_amount !== null ? Number(upto_amount) : null,
      description: description.trim(),
      slug: trimmedSlug,
      store_img,
      claim_form,
      tc: tc.trim(),
      tracking: tracking.trim(),
      cashback_status,
      store_link: store_link.trim(),
      cashback_type,
      cashback_rate: parsedCashbackRate,
      store_status,
      cashback_history: [
        {
          cashback_type,
          cashback_rate: parsedCashbackRate,
          start_date: new Date(),
          upto_amount: upto_amount !== undefined && upto_amount !== null ? Number(upto_amount) : null,
        },
      ],
    });

    await newStore.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store added successfully.",
        store: newStore,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add store:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add store.",
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
