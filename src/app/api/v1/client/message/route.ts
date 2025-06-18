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
      page = 1,
      limit = 20,
    } = body;

    const {
      authenticated,
      user,
      message,
    } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build query
    const query: Record<string, unknown> = {};

    query.userId = user?._id
    
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
         .lean()
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
