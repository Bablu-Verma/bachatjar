
import LiveDealModel from '@/model/LiveDeal';

import dbConnect from '@/lib/dbConnect';
import { authenticateAndValidateUser } from '@/lib/authenticate';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: You do not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing _id in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await LiveDealModel.findByIdAndDelete(_id);

    if (!deleted) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Deal not found or already deleted" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "Deal deleted successfully", data: deleted }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Delete failed ❌", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


