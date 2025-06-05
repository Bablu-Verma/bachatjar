
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


    if (!(usertype === "admin")) {
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

    const body = await req.json();

    const {
      title,
      price,
      source,
      client_id,
      image,
      real_price,
    } = body;


    if (
      !title ||
      !price ||
      !source ||
      !client_id ||
      !image 
    ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Add Filed required ", }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
  
    }

    const liveDeal = await LiveDealModel.create({
      title,
      price,
      source,
      create_date: new Date(),
      client_id,
      image,
      real_price,
    });

    return new NextResponse(
      JSON.stringify({ success: false, message: "Products saved to MongoDB. ", data :liveDeal }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );


  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}
