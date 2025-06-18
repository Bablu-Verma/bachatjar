// app/api/message/send/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { sendMessage } from "@/lib/sendMessage";
import { authenticateAndValidateUser } from "@/lib/authenticate";


export async function POST(req: Request) {
  await dbConnect();

  try {

     const { authenticated, usertype, message } = await authenticateAndValidateUser(
              req
            );
            if (!authenticated) {
              return new NextResponse(JSON.stringify({ success: false, message }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
              });
            }
            if (usertype !== "admin") {
              return new NextResponse(
                JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
                { status: 403, headers: { "Content-Type": "application/json" } }
              );
            }

    const { userId, title, body } = await req.json();

    if (!userId || !title || !body) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    await sendMessage({ userId, title, body });

    return NextResponse.json({ success: true, message: "Message sent" }, { status: 201 });
  } catch  {
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}
