
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


    const body = await req.json()

    const { search = "", page = 1 } = body;
    const limit = 10;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { source: { $regex: search, $options: "i" } }
      ];
    }



    const totalItems = await LiveDealModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const deals = await LiveDealModel.find(query)
      .sort({ create_date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Products fetched successfully.",
        data: deals,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems,
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );


  } catch (error) {
    console.error('Scraping failed ❌', error);
  }
}
