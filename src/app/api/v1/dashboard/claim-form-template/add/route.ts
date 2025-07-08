import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import limiter from "@/lib/rateLimiter";
import { RateLimiterRes } from "rate-limiter-flexible";
import ClaimFormTemplateModel from "@/model/ClaimFormTemplate";

export async function POST(req: Request) {
  await dbConnect();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    await limiter.consume(ip);

    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "Authentication required" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    const { store, fields } = await req.json();

    if (!store || !Array.isArray(fields) || fields.length === 0) {
      return NextResponse.json(
        { success: false, message: "Store and fields are required" },
        { status: 400 }
      );
    }

    // Optional validation of each field
    for (const field of fields) {
      if (
        typeof field.label !== "string" ||
        !["text", "number", "date", "file"].includes(field.type) ||
        typeof field.required !== "boolean"
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid field format" },
          { status: 400 }
        );
      }
    }

    // Check if already exists
    const existing = await ClaimFormTemplateModel.findOne({ store });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Claim form already exists for this store" },
        { status: 409 }
      );
    }

    const newTemplate = new ClaimFormTemplateModel({ store, fields });
    await newTemplate.save();

    return NextResponse.json(
      {
        success: true,
        message: "Claim form template created successfully",
        templateId: newTemplate._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating claim form template:", error);

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
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
