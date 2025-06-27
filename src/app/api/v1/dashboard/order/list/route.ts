import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import OrderModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const {
      payment_status,
      user_id,
      store_id,
      transaction_id,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 5;

    if (payment_status && payment_status !== "ALL") {
      query.payment_status = payment_status;
    }
    if (store_id) {
      query.store_id = store_id;
    }

    if (user_id) {
      query.user_id = user_id;
    }

    if (transaction_id) {
      query.transaction_id = transaction_id;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        query.createdAt = { $gte: start, $lte: end };
      }
    }

    

  
   
    const orders = await OrderModel.find(query)
      .populate({
        path: "user_id",
        select: "name email",
      })
      .populate({path:"store_id", select:"name slug"})
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean()

    const totalOrders = await OrderModel.countDocuments(query);


  //  const ordersWithMissingStores = orders.filter(order => !order.store_id);
  //  const ordersWithMissingUser = orders.filter(order => !order.user_id);

  //  console.log('Orders with deleted/missing stores:', ordersWithMissingStores);
  //  console.log('Orders with deleted/missing user:', ordersWithMissingUser);


    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Orders fetched successfully.",
        data: orders,
        pagination: {
          totalPages: Math.ceil(totalOrders / limitNumber),
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch orders.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
