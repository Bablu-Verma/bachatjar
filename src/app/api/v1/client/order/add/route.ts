import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import OrderModel from "@/model/OrderModel";
import StoreModel from "@/model/StoreModel";
import { generateCustomUuid } from "@/helpers/server/uuidv4";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated || !user) {
      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    const body = await req.json();
    const { store_id } = body;

    if (!store_id) {
      return NextResponse.json({ success: false, message: "Store ID is required." }, { status: 400 });
    }

    const store_details = await StoreModel.findById(store_id).select(
      "-cashback_history -description -tc -store_img"
    );

    if (!store_details) {
      return NextResponse.json({ success: false, message: "Store not found." }, { status: 404 });
    }

    if (store_details.store_status !== "ACTIVE") {
      return NextResponse.json({ success: false, message: "Store not Active." }, { status: 400 });
    }

    const transactionId = generateCustomUuid();

    const create_order =  new OrderModel({
      user_id: user._id,
      store_id,
      upto_amount:store_details.upto_amount,
      transaction_id: transactionId,
      redirect_url: `${store_details.store_link}?q=redirect+url&id=${transactionId}`,
      order_value: null,
      cashback: null,
      cashback_rate: store_details.cashback_rate,
      cashback_type: store_details.cashback_type,
     
      payment_status: 'Initialize',
      payment_history: [
        {
          status: "Initialize",
          date: new Date(),
          details: "Order created and redirect to partner site",
        },
      ],
    });

   const new_order = await  create_order.save()

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        url: new_order.redirect_url,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the order.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
