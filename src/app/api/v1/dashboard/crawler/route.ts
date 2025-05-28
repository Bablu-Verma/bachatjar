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

    const { name, startDate, endDate, source, page = 1, limit = 10 } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (startDate && endDate) {
      query.startDate = { $gte: new Date(startDate) };
      query.endDate = { $lte: new Date(endDate) };
    }

    if (source) {
      query.source = source;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      LiveDealModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
      LiveDealModel.countDocuments(query)
    ]);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Live deals fetched successfully.",
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('LiveDeal fetch failed ❌', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred while fetching live deals.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
