/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PinbackResponseModel from "@/model/PinbackResponseModel";
import OrderModel from "@/model/OrderModel";
import { parse } from "csv-parse/sync";
import { generateSignature } from "@/helpers/server/uuidv4";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const text = Buffer.from(bytes).toString("utf-8");

    // Parse CSV
    const records: any[] = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length === 0) {
      return NextResponse.json({ success: false, message: "Empty file." }, { status: 400 });
    }

    let successCount = 0;
    let failedCount = 0;
    const failedRows: any[] = [];

    for (const raw_data of records) {
      try {
        const { click_id, transaction_id, status, amount, commission, source } = {
          ...raw_data,
          amount: Number(raw_data.amount),
          commission: Number(raw_data.commission),
        };
    
        if (!click_id || isNaN(amount) || isNaN(commission)) {
          failedCount++;
          failedRows.push({ click_id, reason: "Required fields missing" });
          continue;
        }
    
        // Click ID validation
        let isSignatureValid = true;
        if (click_id) {
          const parts = click_id.split("-");
          const extractedSignature = parts.pop();
          const originalData = parts.join("-");
          const generatedSignature = generateSignature(originalData);
    
          if (generatedSignature !== extractedSignature) {
            isSignatureValid = false;
          }
        }
    
        if (!isSignatureValid) {
          failedCount++;
          failedRows.push({ click_id, reason: "Invalid Signature" });
          continue; 
        }
    
        // Save pinback response
        const pinbackResponse = new PinbackResponseModel({
          click_id,
          transaction_id,
          status,
          amount,
          commission,
          source,
          raw_data,
        });

        try {
          await pinbackResponse.save();
        } catch (error: any) {
          // Duplicate entry handle
          if (error.code === 11000) {
            failedCount++;
            failedRows.push({ click_id, reason: "Duplicate click_id" });
            continue;
          } else {
            throw error;
          }
        }
    
        // Find and update Order
        const findOrder = await OrderModel.findOne({ transaction_id: click_id }).select("-redirect_url");
    
        if (!findOrder) {
          console.log("No matching order found for click_id:", click_id);
          return;
        }
        
        console.log("findOrder.upto_amount:", findOrder.upto_amount);
        console.log("Order amount:", amount);
        
        const applicableAmount = findOrder.upto_amount
          ? Math.min(amount, findOrder.upto_amount)
          : amount;
        
        console.log("Applicable Amount for Cashback:", applicableAmount);
        
        // Step 2: Calculate final cashback
        let finalCashback = 0;
        
        if (findOrder.cashback_type === "PERCENTAGE") {
          finalCashback = (applicableAmount * (findOrder.cashback_rate || 0)) / 100;
        } else if (findOrder.cashback_type === "FLAT_AMOUNT") {
          finalCashback = findOrder.cashback_rate || 0;
        }
        
        // Optional: Round cashback to 2 decimal places
        finalCashback = Math.round(finalCashback * 100) / 100;
        
        // Step 3: Update order fields
        findOrder.order_value = amount;
        findOrder.cashback = finalCashback;
        
        // Step 4: Update payment status if provided
        if (status?.toLowerCase() === "pending") {
    
          findOrder.payment_status = "Pending";
          findOrder.payment_history.push({
            status: "Pending",
            date: new Date(),
            details: "Payment updated to status Pending",
          });
        }


        await findOrder.save();

        
        successCount++;
      } catch (err) {
        console.error("Error processing record:", raw_data, err);
        failedCount++;
        failedRows.push({ click_id: raw_data.click_id, reason: "Processing error" });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Processed ${successCount} records successfully. ${failedCount} failed.`,
      failedRows,
    }, { status: 200 });

  } catch (error) {
    console.error("Error in offline report upload:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
