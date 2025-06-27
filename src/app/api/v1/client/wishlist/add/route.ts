import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import WishlistModel from "@/model/WishlistModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import { RateLimiterRes } from "rate-limiter-flexible";
import limiter from "@/lib/rateLimiter";

export async function POST(req: Request) {
  await dbConnect();

const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip") ||
  "unknown";

  try {

      await limiter.consume(ip);
    // Authenticate the user
    const { authenticated, user, message } =
      await authenticateAndValidateUser(req);

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

    const user_id = user?._id;

    const { product_id } = await req.json();

    if (!product_id) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Campaign ID is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
    // console.log('product_id', product_id)

    let wishlist = await WishlistModel.findOne({ user_id });

    if (wishlist) {
      if (wishlist.campaigns.includes(product_id)) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Campaign is already in the wishlist.",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      wishlist.campaigns.push(product_id);
    } else {
      wishlist = new WishlistModel({
        user_id,
        campaigns: [product_id],
      });
    }

    await wishlist.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Campaign added to wishlist successfully.",
        data: wishlist,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to add to wishlist:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to add to wishlist.",
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
