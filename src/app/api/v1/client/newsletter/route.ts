// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Newsletter from "@/model/Newsletter";
import { newsletter_subscribe } from "@/email/newsletter_subscribe";
import limiter from "@/lib/rateLimiter";
import { RateLimiterRes } from "rate-limiter-flexible";


export async function POST(req: Request) {
  await dbConnect();

  const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

  try {

     await limiter.consume(ip);

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

     if ((error as RateLimiterRes).msBeforeNext !== undefined) {
                const retryAfter = Math.ceil((error as RateLimiterRes).msBeforeNext / 1000);
                return new NextResponse(
                  JSON.stringify({
                    success: false,
                    message: `Too many requests. Try again in ${retryAfter} seconds.`,
                  }),
                  {
                    status: 429,
                    headers: {
                      "Content-Type": "application/json",
                      "Retry-After": retryAfter.toString(),
                    },
                  }
                );
              }
    

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
