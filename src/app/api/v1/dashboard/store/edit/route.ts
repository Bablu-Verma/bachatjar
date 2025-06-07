import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import CategoryModel from "@/model/CategoryModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json({ success: false, message: message || "User is not authenticated" }, { status: 401 });
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return NextResponse.json({ success: false, message: "Access denied: You do not have the required role" }, { status: 403 });
    }

    const {
      slug,
      name,
      description,
      store_img,
      category,
      tc,
      tracking,
      store_link,
      cashback_type,
      cashback_rate,
      store_status,
      upto_amount,
      min_amount,
      claim_form,
      store_type,
    } = await req.json();

    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required to identify the store." }, { status: 400 });
    }

    const store = await StoreModel.findOne({ slug });
    if (!store) {
      return NextResponse.json({ success: false, message: "Store not found." }, { status: 404 });
    }

    // Validate required fields
    if (!cashback_type || cashback_rate === undefined || !store_type) {
      return NextResponse.json({ success: false, message: "cashback_type, cashback_rate, and store_type are required." }, { status: 400 });
    }

    if (!["INSENTIVE", "NON_INSENTIVE"].includes(store_type)) {
      return NextResponse.json({ success: false, message: "Invalid store_type." }, { status: 400 });
    }

    const parsedCashbackRate = Number(cashback_rate);
    if (isNaN(parsedCashbackRate) || parsedCashbackRate <= 0) {
      return NextResponse.json({ success: false, message: "Cashback rate must be a valid number greater than 0." }, { status: 400 });
    }

    if (store_type === "INSENTIVE" && (!tracking || tracking.trim() === "")) {
      return NextResponse.json({ success: false, message: "Tracking is required for INSENTIVE stores." }, { status: 400 });
    }

    if (category) {
      const categoryExists = await CategoryModel.findById(category);
      if (!categoryExists) {
        return NextResponse.json({ success: false, message: "Invalid category ID." }, { status: 400 });
      }
      store.category = category;
    }

    // Cashback history update check
    const isCashbackTypeChanged = cashback_type !== store.cashback_type;
    const isCashbackRateChanged = parsedCashbackRate !== store.cashback_rate;
    const isUptoChanged = min_amount !== undefined && Number(upto_amount) !== Number(store.upto_amount);
    const isMinAmountChanged = upto_amount !== undefined && Number(min_amount) !== Number(store.min_amount);

    if (
      store_type === "INSENTIVE" &&
      (isCashbackTypeChanged || isCashbackRateChanged || isUptoChanged || isMinAmountChanged)
    ) {
      if (store.cashback_history.length > 0) {
        const last = store.cashback_history[store.cashback_history.length - 1];
        if (!last.end_date) {
          last.end_date = new Date();
        }
      }

      store.cashback_history.push({
        cashback_type,
        cashback_rate: parsedCashbackRate.toString(),
        start_date: new Date(),
        upto_amount: upto_amount !== undefined ? Number(upto_amount) : store.upto_amount ?? null,
        min_amount: min_amount !== undefined ? Number(min_amount) : store.min_amount ?? null,
      });
    }

    // Update store fields
    if (name?.trim()) store.name = name.trim();
    if (description?.trim()) store.description = description.trim();
    if (store_img?.trim()) store.store_img = store_img.trim();
    if (tc?.trim()) store.tc = tc.trim();
    if (tracking?.trim()) store.tracking = tracking.trim();
    if (store_link?.trim()) store.store_link = store_link.trim();

    store.cashback_type = cashback_type;
    store.cashback_rate = parsedCashbackRate;
    store.store_type = store_type;
    if (upto_amount !== undefined) store.upto_amount = Number(upto_amount);
    if (min_amount !== undefined) store.min_amount = Number(min_amount);
    if (store_status?.trim()) store.store_status = store_status;
    if (claim_form?.trim()) store.claim_form = claim_form;

    await store.save();

    return NextResponse.json({ success: true, message: "Store updated successfully.", store }, { status: 200 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Store update error:", errorMsg);
    return NextResponse.json({ success: false, message: "Failed to update store.", error: errorMsg }, { status: 500 });
  }
}
