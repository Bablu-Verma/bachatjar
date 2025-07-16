import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";

import limiter from "@/lib/rateLimiter";
import { RateLimiterRes } from "rate-limiter-flexible";
import ClaimFormModel from "@/model/ClaimFormData";

export async function POST(req: Request) {
  await dbConnect();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    await limiter.consume(ip);

    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated || !user) {
      return NextResponse.json(
        { success: false, message: message || "Authentication required" },
        { status: 401 }
      );
    }


    const request_data = await req.json();

    // console.log("request_data", request_data)

    const {
      store_id,
      reason,
      transaction_id,
      dynamic_fields
    } = request_data



    // Validate required fields
    if (!store_id || !reason) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }





    const newClaim = new ClaimFormModel({
      user_id: user._id,
      store_id,
      reason,
      transaction_id,
      dynamic_fields,
      status: "PENDING"
    });

    await newClaim.save();

    return NextResponse.json(
      {
        success: true,
        message: "Claim submitted successfully",
        // claimId: newClaim._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting claim:", error);

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
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
