import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
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

   
    const requestData = await req.json();


    const {name,profile,phone,dob,gender } = requestData
    
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: any = {};

    if (name) {
      if (typeof name === "string" && name.length <= 2) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Enter a valid name",
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        updateFields.name = name;
      }
    }
    if (phone) {
      if (typeof phone === "string" && phone.trim().length == 10) {
        updateFields.phone = phone;
      } else {
        return new NextResponse(
          JSON.stringify({
            success: false,
            message: "Enter a valid phone number",
          }),
          {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    if (profile) updateFields.profile = profile
    if (dob) updateFields.dob = dob;
    if (gender) updateFields.gender = gender;

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: user?.email },
      updateFields,
      { new: true }
    ).select('-user_status -address -verify_code -password');

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update profile.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Profile updated successfully.",
        data: updatedUser,
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
      console.error("Failed to update profile:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to update profile.",
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
