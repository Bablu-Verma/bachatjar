import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import OrderModel from "@/model/OrderModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Authenticate user
    const { authenticated, user, message } = await authenticateAndValidateUser(req);
    if (!authenticated || !user) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Get parameters from request
    const { page = 1, activetab = null } = await req.json();

    const limit = 16;
    const skip = (Number(page) - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { user_id: user._id };
    if (activetab) {
      filter.payment_status = activetab; 
    }

    const orders = await OrderModel.find(filter)
      .populate('store_id', "name slug store_img")
      .select('-redirect_url')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Orders fetched successfully.",
        data: orders,
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
