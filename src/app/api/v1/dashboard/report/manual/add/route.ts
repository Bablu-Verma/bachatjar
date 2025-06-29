import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/OrderModel";
import ClientReport from "@/model/ClientReport";
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


    const requestData = await req.json();
    const {
      click_id,
      order_id,
      order_status,
      product_name,
      order_amount,
      commission_earned,
      order_date,
      reporttype = "initial", // default to initial
    } = requestData;

    // Basic validation
    if (!click_id || !order_id || !order_amount || !commission_earned) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const amount = Number(order_amount);
    const commission = Number(commission_earned);

    if (isNaN(amount) || isNaN(commission)) {
      return NextResponse.json(
        { success: false, message: "Amount or commission is not a valid number" },
        { status: 400 }
      );
    }

    // Signature validation
    const parts = click_id.split("-");
    const extractedSignature = parts.pop();
    const originalData = parts.join("-");
    const expectedSignature = generateSignature(originalData);

    if (expectedSignature !== extractedSignature) {
      return NextResponse.json(
        { success: false, message: "Invalid click_id signature" },
        { status: 400 }
      );
    }


    const order = await OrderModel.findOne({ transaction_id: click_id }).select("-redirect_url");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "No matching order found for click_id" },
        { status: 404 }
      );
    }

    // Report handling
    const existingReport = await ClientReport.findOne({ click_id });

    if (reporttype.toLowerCase() === "initial") {
      if (existingReport) {
        return NextResponse.json(
          { success: false, message: "Duplicate click_id (already exists)" },
          { status: 409 }
        );
      }

      const report = new ClientReport({
        click_id,
        order_id,
        status: order_status,
        amount,
        store: order.store_id,
        commission,
        raw_data: requestData,
        product_name,
        order_date,
        report_type: "OFFLINE",
      });

      await report.save();
    } else if (reporttype.toLowerCase() === "followup") {
      if (!existingReport) {
        return NextResponse.json(
          { success: false, message: "No existing record found for follow-up" },
          { status: 404 }
        );
      }

      existingReport.order_id = order_id;
      existingReport.status = order_status;
      existingReport.amount = amount;
      existingReport.commission = commission;
      existingReport.product_name = product_name;
      existingReport.order_date = order_date;
      existingReport.raw_data = requestData;
      existingReport.updatedAt = new Date();

      await existingReport.save();
    }

    // Order handling




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


    console.log('order==', order)

    console.log("cashback...", cashback)

    order.order_value = amount;
    order.cashback = cashback;

    const upperStatus = order_status?.toUpperCase();

    if (upperStatus === "PENDING" || upperStatus === "DELIVERED") {
      order.payment_status = "Pending";
      order.payment_history.push({
        status: "Pending",
        date: new Date(),
        details: "Payment updated to Pending based on manual report",
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

    } else if (upperStatus === "CANCELLED" || upperStatus === "RETURNED") {
      order.payment_status = "Failed";
      order.payment_history.push({
        status: "Failed",
        date: new Date(),
        details: "Order is cancelled based on manual report",
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

    return NextResponse.json({
      success: true,
      message: "Manual record saved/updated successfully",
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
