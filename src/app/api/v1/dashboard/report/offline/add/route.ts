import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/OrderModel";
import ClientReport from "@/model/ClientReport";
import { parse } from "csv-parse/sync";
import { generateSignature } from "@/helpers/server/uuidv4";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import { sendMessage } from "@/lib/sendMessage";

export async function POST(req: Request) {
  await dbConnect();

  try {

     const { authenticated, usertype, message } = await authenticateAndValidateUser(req);
    
        if (!authenticated) {
          return NextResponse.json(
            { success: false, message: message || "User is not authenticated" },
            { status: 401 }
          );
        }
    
        if (usertype !== "admin") {
          return NextResponse.json(
            { success: false, message: "Access denied: Only admin can delete users" },
            { status: 403 }
          );
        }


    const formData = await req.formData();
    const file = formData.get("file") as File;
    const reporttype = (formData.get("reporttype") as string || "initial").toLowerCase(); // default to "initial"

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

 

    const buffer = Buffer.from(await file.arrayBuffer());
    const csvText = buffer.toString("utf-8");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

          // Update Order
        const order = await OrderModel.findOne({ transaction_id: click_id }).select("-redirect_url");

        if (!order) {
          failedCount++;
          failedRows.push({ click_id, reason: "No matching order found for click_id" });
          continue;
        }
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
            store: order.store_id,
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

      

        const applicableAmount = order.upto_amount
          ? Math.min(amount, order.upto_amount)
          : amount;

        let cashback = 0;

        if (order.cashback_type === "PERCENTAGE") {
          cashback = (applicableAmount * (order.cashback_rate || 0)) / 100;
        } else if (order.cashback_type === "FLAT_AMOUNT") {
          cashback = Math.min(order.cashback_rate || 0, applicableAmount);
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

               await sendMessage({
            userId: order.user_id.toString(),
            title: `Update on Your Order – Transaction ID: ${click_id}`,
            body: `Hi there,
          
          Your order with Transaction ID **${click_id}** has been updated to the status: **Pending**.
          
          You can view the complete order history anytime on your BachatJar dashboard.
          
          If you have any questions or did not initiate this request, please contact our support team immediately.
          
          Thank you,  
          The BachatJar Team 💸`
          });
          
        } else if (upperStatus === "CANCELLED" || upperStatus === 'RETURNED') {
          order.payment_status = "Failed";
          order.payment_history.push({
            status: "Failed",
            date: new Date(),
            details: "Order is cancelled based on offline report",
          });
           await sendMessage({
            userId: order.user_id.toString(),
            title: `Important Update: Order Failed – Transaction ID: ${click_id}`,
            body: `Hi there,

          We regret to inform you that your order with Transaction ID **${click_id}** has been marked as **Failed**.

          We understand this might be disappointing. Sometimes, failures occur due to issues like incomplete transactions or discrepancies in order details.

          You can check more information in your BachatJar dashboard. If you believe this is a mistake or need assistance, please reach out to our support team — we’re here to help.

          Thank you for your understanding,  
          The BachatJar Team 💸`
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
