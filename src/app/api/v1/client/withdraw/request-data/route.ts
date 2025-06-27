import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ConformAmountModel from "@/model/ConformAmountModel";
import UserUPIModel from "@/model/UserUPIModel";
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


    const { authenticated, user, message } = await authenticateAndValidateUser(req);
   
    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const userId = user?._id;
    
    const amountDetails = await ConformAmountModel.findOne({ user_id: userId });

    // console.log(amountDetails)

    const upiDetails = await UserUPIModel.find({
      user_id: userId,
      status: "ACTIVE",
    }).select("-otp");

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Withdrawal request details retrieved successfully.",
        data: {
          amountDetails: amountDetails ? amountDetails.amount : null,
          upiDetails: upiDetails || [],
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve withdrawal request details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve withdrawal request details.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
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
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
