import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReferralModel from "@/model/ReferralModel"; // Make sure the model path is correct
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
    const { referralId } = await req.json();

    if (!referralId) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Referral ID is required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const referral = await ReferralModel.findById(referralId);

    if (!referral) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Referral details not found.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (referral.status === "DELETE") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Referral is already deleted." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Soft delete: change status to DELETE
    referral.status = "DELETE";
    await referral.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Referral deleted successfully.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Failed to delete referral:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to delete referral.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
