import { user_verify_email } from "@/email/user_verify";
import { generateJwtToken } from "@/helpers/server/server_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";

import dbConnect from "@/lib/dbConnect";
import limiter from "@/lib/rateLimiter";
import UserModel from "@/model/UserModel";

import { NextResponse } from "next/server";
import { RateLimiterRes } from "rate-limiter-flexible";

// varify valid user

export async function POST(request: Request) {
  await dbConnect();

    const ip =
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "unknown";

  
  try {

   await limiter.consume(ip);

    const { authenticated, user, message } = await authenticateAndValidateUser(
    request
  );


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


    const findUser = await UserModel.findOne({ email: user?.email });

    const Payload = {
      email: findUser.email,
    };

    const userData = findUser.toObject();

    delete userData.password;
    delete userData.accept_terms_conditions_privacy_policy;
    delete userData.email_verified;
    delete userData.phone_verified;
    delete userData.verify_code;
    delete userData.verify_code_expiry;
    delete userData.user_status;
    delete userData.subscribe_email;
    delete userData.__v;

    const minutes_30 = 60 * 30; // 30 minutes in seconds
    const JwtToken = await generateJwtToken(Payload, minutes_30);
    user_verify_email(findUser.verify_code, findUser.email);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "otp re-send sucessfull",
        token: JwtToken,
        user: userData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error verify user", error);

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
        message: "Failed to resend otp",
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
