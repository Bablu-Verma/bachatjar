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

    const {
      slug,
      description,
      category,
      tc,
      claim_form,
      upto_amount,
      tracking,
      store_img,
      cashback_status,
      store_link,
      cashback_type,
      cashback_rate,
      store_status,
    } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Slug is required to update the store." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const store = await StoreModel.findOne({ slug });

    if (!store) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Store not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

   
    const isCashbackTypeChanged = cashback_type && cashback_type !== store.cashback_type;
    const isCashbackRateChanged =cashback_rate !== undefined && cashback_rate.toString() !== store.cashback_rate.toString();
    const isUptoAmountChanged =
    upto_amount !== undefined &&
    (store.upto_amount === undefined ||
      Number(upto_amount) !== Number(store.upto_amount));


    if (isCashbackTypeChanged || isCashbackRateChanged || isUptoAmountChanged) {
    
      if (store.cashback_history.length > 0) {
        const lastHistory = store.cashback_history[store.cashback_history.length - 1];
        if (!lastHistory.end_date) {
          lastHistory.end_date = new Date();
        }
      }

      store.cashback_history.push({
        cashback_type: cashback_type || store.cashback_type,
        cashback_rate: cashback_rate?.toString() || store.cashback_rate.toString(),
        start_date: new Date(),
         upto_amount: upto_amount !== undefined ? Number(upto_amount) : store.upto_amount ?? null,
      });

      if (isCashbackTypeChanged) store.cashback_type = cashback_type;
      if (isCashbackRateChanged) store.cashback_rate = cashback_rate.toString();
      if (isUptoAmountChanged) store.upto_amount = Number(upto_amount);
    }


    if (description !== undefined && description !== "") store.description = description;
    if (store_img !== undefined && store_img !== "") store.store_img = store_img;
    if (cashback_status !== undefined && cashback_status !== "") store.cashback_status = cashback_status;
    if (store_link !== undefined && store_link !== "") store.store_link = store_link;
    if (store_status !== undefined && store_status !== "") store.store_status = store_status;
    if (category !== undefined && category !== "") store.category = category;
    if (tc !== undefined && tc !== "") store.tc = tc;
    if (tracking !== undefined && tracking !== "") store.tracking = tracking;
    if (claim_form !== undefined && claim_form !=='') store.claim_form = claim_form;
      

    await store.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store updated successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to update store:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to update store.", error: error.message }),
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
