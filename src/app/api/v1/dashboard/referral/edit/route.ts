import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReferralModel from "@/model/ReferralModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import { generateSlug } from "@/helpers/client/client_function"; // adjust as needed

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } =
      await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!(usertype === "admin" || usertype === "data_editor")) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: You do not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const requestData = await req.json();
    const { _id, title, description, imageUrl, rewardForUser, referralLink, status } = requestData;

    if (!_id ) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "_id  are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 1: Find current referral by ID
    const currentReferral = await ReferralModel.findById(_id);
    if (!currentReferral) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Referral not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
   
    if (title?.trim()) {
      if (title !== currentReferral.title) {
        const slug = generateSlug(title);
        const existingReferral = await ReferralModel.findOne({
          slug,
          _id: { $ne: _id }
        });

        if (existingReferral) {
          return NextResponse.json(
            { success: false, message: "Another referral with this title already exists." },
            { status: 400 }
          );
        }

        currentReferral.title = title;
        currentReferral.slug = slug;
      }
    }

    // Step 3: Update other fields
    if (description?.trim()) currentReferral.description = description;
    if (imageUrl?.trim()) currentReferral.imageUrl = imageUrl;
    if (rewardForUser?.trim()) currentReferral.rewardForUser = rewardForUser;
    if (referralLink?.trim()) currentReferral.referralLink = referralLink;
    if (status && ["ACTIVE", "PAUSE", "DELETE"].includes(status)) currentReferral.status = status;

    await currentReferral.save();

    return new NextResponse(
      JSON.stringify({ success: true, message: "Referral details updated successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error updating referral:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to update referral.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
