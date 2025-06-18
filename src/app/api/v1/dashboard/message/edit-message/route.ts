// app/api/message/edit/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/model/Message";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { messageId, title, body, read } = await req.json();

    if (!messageId) {
      return NextResponse.json({ success: false, message: "messageId is required" }, { status: 400 });
    }

type MessageUpdate = {
  title?: string;
  body?: string;
  read?: boolean;
};

const updateData: MessageUpdate = {};




    if (typeof title === "string") updateData.title = title;
    if (typeof body === "string") updateData.body = body;
    if (typeof read === "boolean") updateData.read = read;

    const updated = await Message.findByIdAndUpdate(messageId, updateData, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message updated", data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Update failed", error: (err as Error).message }, { status: 500 });
  }
}
