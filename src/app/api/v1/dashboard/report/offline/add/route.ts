import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/OrderModel";
import ClientReport from "@/model/ClientReport";
import { parse } from "csv-parse/sync";
import { generateSignature } from "@/helpers/server/uuidv4";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const storeId = formData.get("storeId") as string;
    const reporttype = (formData.get("reporttype") as string || "initial").toLowerCase(); // default to "initial"

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

    if (!storeId) {
      return NextResponse.json({ success: false, message: "Store ID is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvText = buffer.toString("utf-8");

    const records: any[] = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      return NextResponse.json({ success: false, message: "Uploaded file is empty." }, { status: 400 });
    }

    let successCount = 0;
    let failedCount = 0;
    const failedRows: any[] = [];

    for (const raw_data of records) {
      try {
        const {
          tracking_id: click_id,
          order_id,
          order_status: status,
          order_amount: rawAmount,
          commission_earned: rawCommission,
        
        } = raw_data;

        const amount = Number(rawAmount);
        const commission = Number(rawCommission);

        // Basic field validation
        if (!click_id || isNaN(amount) || isNaN(commission)) {
          failedCount++;
          failedRows.push({ click_id, reason: "Missing or invalid click_id, amount, or commission" });
          continue;
        }

        // Signature Validation
        const parts = click_id.split("-");
        const extractedSignature = parts.pop();
        const originalData = parts.join("-");
        const expectedSignature = generateSignature(originalData);

        if (expectedSignature !== extractedSignature) {
          failedCount++;
          failedRows.push({ click_id, reason: "Invalid click_id signature" });
          continue;
        }

        const existingReport = await ClientReport.findOne({ click_id });

        if (reporttype === "initial") {
          if (existingReport) {
            failedCount++;
            failedRows.push({ click_id, reason: "Duplicate click_id (already saved)" });
            continue;
          }

          const report = new ClientReport({
            click_id,
            order_id,
            status,
            amount,
            commission,
            raw_data,
            store: storeId,
            report_type: "OFFLINE",
          });

          await report.save();

        } else if (reporttype === "followup") {
          if (!existingReport) {
            failedCount++;
            failedRows.push({ click_id, reason: "No existing record found for follow-up" });
            continue;
          }

          existingReport.order_id = order_id;
          existingReport.status = status;
          existingReport.amount = amount;
          existingReport.commission = commission;
          existingReport.raw_data = raw_data;
          existingReport.updatedAt = new Date();

          await existingReport.save();
        }

        // Update Order
        const order = await OrderModel.findOne({ transaction_id: click_id }).select("-redirect_url");

        if (!order) {
          failedCount++;
          failedRows.push({ click_id, reason: "No matching order found for click_id" });
          continue;
        }

        const applicableAmount = order.upto_amount
          ? Math.min(amount, order.upto_amount)
          : amount;

        let cashback = 0;

        if (order.cashback_type === "PERCENTAGE") {
          cashback = (applicableAmount * (order.cashback_rate || 0)) / 100;
        } else if (order.cashback_type === "FLAT_AMOUNT") {
          cashback = order.cashback_rate || 0;
        }

        cashback = Math.round(cashback * 100) / 100;

        order.order_value = amount;
        order.cashback = cashback;

        const upperStatus = status?.toUpperCase();

        if (upperStatus === "PENDING" || upperStatus === "DELIVERED") {
          order.payment_status = "Pending";
          order.payment_history.push({
            status: "Pending",
            date: new Date(),
            details: "Payment updated to Pending based on offline report",
          });
        } else if (upperStatus === "CANCELLED" || upperStatus === 'RETURNED') {
          order.payment_status = "Failed";
          order.payment_history.push({
            status: "Failed",
            date: new Date(),
            details: "Order is cancelled based on offline report",
          });
        }

        await order.save();
        successCount++;

      } catch (error) {
        console.error("Error processing record:", raw_data, error);
        failedCount++;
        failedRows.push({
          click_id: raw_data.tracking_id || "Unknown",
          reason: "Unhandled processing error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${successCount} records. ${failedCount} failed.`,
      failedRows,
    });

  } catch (error) {
    console.error("Unexpected server error:", error);
    return NextResponse.json({
      success: false,
      message: "Unexpected server error",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
