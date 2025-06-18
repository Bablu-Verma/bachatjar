// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Newsletter from "@/model/Newsletter";
import { newsletter_subscribe } from "@/email/newsletter_subscribe";


export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: "Valid email is required." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already subscribed." },
        { status: 409 }
      );
    }

    // Create new subscription
    await Newsletter.create({ email });

    newsletter_subscribe(email)
    
    return NextResponse.json(
      {
        success: true,
        message: "Email subscribed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in newsletter POST:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while subscribing.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
