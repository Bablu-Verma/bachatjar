// app/api/message/list/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import Message from "@/model/Message";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const {
      userId = "",
      title = "",
      startDate = "",
      endDate = "",
      page = 1,
      limit = 50,
    } = body;

    const {
      authenticated,
      usertype,
      message,
    } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Role check
    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: Cannot access other users' messages",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (userId) {
      query.userId = userId
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId','name email')
        ,
      Message.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Messages fetched successfully",
        data: messages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Message fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
