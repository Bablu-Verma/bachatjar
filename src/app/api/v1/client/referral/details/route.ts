import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReferralModel from "@/model/ReferralModel"; // Make sure model path is correct

export async function POST(req: Request) {
  await dbConnect();

  try {
    

  

  
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

    const referral = await ReferralModel.findOne({ slug , status:'ACTIVE'}).populate("category", "name slug") ;

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
