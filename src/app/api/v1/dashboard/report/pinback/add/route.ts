import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/OrderModel";
import ClientReport from "@/model/ClientReport";
import { sendMessage } from "@/lib/sendMessage";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { raw_data } = await req.json();

    if (!raw_data) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "raw_data is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { click_id, status, amount, commission, type } = {
      ...raw_data,
      amount: Number(raw_data.amount),
      commission: Number(raw_data.commission),
    };

    if (!click_id || isNaN(amount) || isNaN(commission)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Required fields missing: click_id, amount, commission",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }


    const findOrder = await OrderModel.findOne({
      transaction_id: click_id,
    }).select("-redirect_url");

    if (!findOrder) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "No matching order found for this click_id",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }


    try {

      if (type === "initial") {
        const report = new ClientReport({
          click_id,
          raw_data,
          store: findOrder.store_id,
          report_type: "PINBACK",
        });

        await report.save();
        // console.log("✅ New client report saved.");
      } else if (type === "followup") {
        const updated = await ClientReport.findOneAndUpdate(
          { click_id },
          {
            $set: {
              raw_data,
            },
          },
          { new: true }
        );

        if (updated) {
          // console.log("✅ Client report updated.");
        } else {
          // console.warn("⚠️ No report found for click_id:", click_id);
        }
      } else {
        // console.error("❌ Invalid type:", type);
        return new NextResponse(
          JSON.stringify({ success: false, message: "Invalid type" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Duplicate entry handle
      if (error.code === 11000) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Click id repated",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      } else {
        throw error;
      }
    }

    const applicableAmount = findOrder.upto_amount
      ? Math.min(amount, findOrder.upto_amount)
      : amount;

    // Step 2: Calculate final cashback
    let finalCashback = 0;

    if (findOrder.cashback_type === "PERCENTAGE") {
      finalCashback = (applicableAmount * (findOrder.cashback_rate || 0)) / 100;
    } else if (findOrder.cashback_type === "FLAT_AMOUNT") {
      finalCashback = Math.min(findOrder.cashback_rate || 0, applicableAmount);
    }

    // Optional: Round cashback to 2 decimal places
    finalCashback = Math.round(finalCashback * 100) / 100;

    // Step 3: Update order fields
    findOrder.order_value = amount;
    findOrder.cashback = finalCashback;

    const upperStatus = status?.toUpperCase();

    if (!Array.isArray(findOrder.payment_history)) {
      findOrder.payment_history = [];
    }

    if (upperStatus === "PENDING" || upperStatus === "DELIVERED") {
      findOrder.payment_status = "Pending";
      findOrder.payment_history.push({
        status: "Pending",
        date: new Date(),
        details: "Payment updated to Pending based on Online report",
      });

      await sendMessage({
        userId: findOrder.user_id.toString(),
        title: `Update on Your Order – Transaction ID: ${click_id}`,
        body: `Hi there,

          Your order with Transaction ID **${click_id}** has been updated to the status: **Pending**.

          You can view the complete order history anytime on your BachatJar dashboard.

          If you have any questions or did not initiate this request, please contact our support team immediately.

          Thank you,  
          The BachatJar Team 💸`
      });




    } else if (upperStatus === "CANCELLED" || upperStatus === 'RETURNED') {
      findOrder.payment_status = "Failed";
      findOrder.payment_history.push({
        status: "Failed",
        date: new Date(),
        details: "Order is cancelled based on Online report",
      });


      await sendMessage({
        userId: findOrder.user_id.toString(),
        title: `Important Update: Order Failed – Transaction ID: ${click_id}`,
        body: `Hi there,

        We regret to inform you that your order with Transaction ID **${click_id}** has been marked as **Failed**.

        We understand this might be disappointing. Sometimes, failures occur due to issues like incomplete transactions or discrepancies in order details.

        You can check more information in your BachatJar dashboard. If you believe this is a mistake or need assistance, please reach out to our support team — we’re here to help.

        Thank you for your understanding,  
        The BachatJar Team 💸`

      });


    }

    // Step 6: Save
    await findOrder.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Pinback response saved successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error saving pinback details:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to save pinback details",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


