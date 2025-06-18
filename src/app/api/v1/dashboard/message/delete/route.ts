// app/api/message/delete/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import Message from "@/model/Message";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(JSON.stringify({ success: false, message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: Only admin can delete messages",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: "Missing messageId" },
        { status: 400 }
      );
    }

    const deleted = await Message.deleteOne({ _id: messageId });

    if (deleted.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Message delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
