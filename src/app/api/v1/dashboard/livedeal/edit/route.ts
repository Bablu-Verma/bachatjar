
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
    const {
      _id,
      title,
      price,
      source,
      client_id,
      image,
      real_price,
    } = body;

    if (!_id || !title || !price || !source || !client_id || !image) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updated = await LiveDealModel.findByIdAndUpdate(
      _id,
      {
        title,
        price,
        source,
        client_id,
        image,
        real_price,
      },
      { new: true }
    );

    if (!updated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Deal not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "Deal updated successfully", data: updated }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Update failed ❌", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

