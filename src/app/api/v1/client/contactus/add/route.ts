import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactUsModel from "@/model/ContactUsModel";
import { RateLimiterRes } from "rate-limiter-flexible";
import limiter from "@/lib/rateLimiter";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegex = /^[0-9]{10}$/; 

export async function POST(req: Request) {
  await dbConnect();
     const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

  try {

     await limiter.consume(ip);

    const { name, email, subject, message, phone_number, location } = await req.json();

    
    if (!name || !email || !subject || !message) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Name, email, subject, and message are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

   
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please provide a valid email address.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (phone_number && !phoneNumberRegex.test(phone_number)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please provide a valid phone number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new contact request
    const newContactRequest = new ContactUsModel({
      name,
      email,
      subject,
      message,
      phone_number,
      location,
    });

    // Save to the database
    await newContactRequest.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Contact request submitted successfully.",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting contact request:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to submit contact request.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);

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
      

      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
