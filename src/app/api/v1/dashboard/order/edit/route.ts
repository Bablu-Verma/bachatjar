import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import OrderModel from "@/model/OrderModel";
import ConformAmountModel from "@/model/ConformAmountModel";
import { sendMessage } from "@/lib/sendMessage";


export async function POST(req: Request) {
  await dbConnect();

  try {

    const { authenticated, message, usertype } = await authenticateAndValidateUser(req);
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

    const { record_id, payment_status, payment_details } = await req.json();

    if (!record_id) {
      return new NextResponse(JSON.stringify({ success: false, message: "Record ID is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Find the record
    const record = await OrderModel.findById(record_id);

    if (!record) {
      return new NextResponse(JSON.stringify({ success: false, message: "Record not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Check if any updates are provided
    if (!payment_status) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "No updates provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (payment_status) {
      record.payment_status = payment_status;
      record.payment_history.push({
        status: payment_status,
        date: new Date(),
        details: payment_details || `Payment status updated to ${payment_status}`,
      });

      // ✅ Send message for payment status update
      await sendMessage({
        userId: record.user_id.toString(),
        title: `Payment Status Updated – ${payment_status}`,
        body: `Hi there,

Your payment status has been updated to **${payment_status}** on BachatJar.

Details: ${payment_details || "No additional information provided."}

Thank you,  
The BachatJar Team`
      });
    }

    if (payment_status === 'Confirmed') {
      const existing = await ConformAmountModel.findOne({ user_id: record.user_id });

      if (existing) {
        existing.amount += record.cashback;
        await existing.save();
      } else {
        await ConformAmountModel.create({
          amount: record.cashback,
          user_id: record.user_id,
        });
      }

      // ✅ Send message for confirmed cashback amount
      await sendMessage({
        userId: record.user_id.toString(),
        title: "Cashback Confirmed – BachatJar",
        body: `Hi there,

Good news! 🎉 Your cashback of ₹${record.cashback} has been confirmed and added to your BachatJar wallet.

You can withdraw or use it as per your preference.

Keep saving,  
The BachatJar Team 💸`
      });

    }


    await record.save();
    return new NextResponse(
      JSON.stringify({ success: true, message: "Order updated successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Failed to update order:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to update order.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
