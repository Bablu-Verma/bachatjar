// app/api/message/read/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/model/Message";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json({ success: false, message: "messageId is required" }, { status: 400 });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { read: 'TRUE' },
      { new: true }
    );

    if (!updatedMessage) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Message marked as read",
      data: updatedMessage,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Failed to mark as read",
      error: (err as Error).message,
    }, { status: 500 });
  }
}
