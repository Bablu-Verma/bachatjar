import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReferralModel from "@/model/ReferralModel"; // Make sure model path is correct
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

   if (usertype !== "admin" ) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const { slug } = await req.json();

    if (!slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Slug is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const referral = await ReferralModel.findOne({ slug }).populate("category", "name slug") ;

    if (!referral) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Referral campaign not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Referral details fetched successfully.",
        data: referral,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching referral:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch referral.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
