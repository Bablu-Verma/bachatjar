import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ReferralModel from "@/model/ReferralModel";



export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (usertype !== "admin") {
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

    // Destructure from request
    const {
      title,
      description,
      referralLink,
      imageUrl,
      rewardForUser,
      category,
      status = 'ACTIVE',
    } = await req.json();

    // Validate required fields
    if (!title || !description || !referralLink || !category || !rewardForUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Required fields: title, description, referralLink, category",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const slug = generateSlug(title);

    // Check for duplicate
    const existingReferral = await ReferralModel.findOne({
      $or: [{ title }, { slug }],
    });

    if (existingReferral) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "A referral campaign with this title or slug already exists.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create new referral campaign
    const newReferral = new ReferralModel({
      title,
      slug,
      description,
      referralLink,
      imageUrl,
      rewardForUser,
      category,
      status,
    });

    await newReferral.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Referral campaign added successfully.",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Failed to add referral:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to add referral campaign.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
