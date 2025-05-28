import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

import { authenticateAndValidateUser } from "@/lib/authenticate";
import UserUPIModel from "@/model/UserUPIModel";
import { generateOTP } from "@/helpers/server/server_function";
import { upi_verify_email } from "@/email/user_upi_verify";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate the user
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated || !user) {
      return NextResponse.json(
        { success: false, message: message || "User is not authenticated" },
        { status: 401 }
      );
    }

    const user_id = user._id;
    const user_email = user.email;

    if (!user_email) {
      return NextResponse.json(
        { success: false, message: "User email is missing." },
        { status: 400 }
      );
    }

    const { upi_link_bank_name, upi_holder_name_aspr_upi, upi_id } = await req.json();

    // Validation: Ensure required fields exist
    if (!upi_link_bank_name || !upi_holder_name_aspr_upi || !upi_id) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const upiIdNormalized = upi_id.trim().toLowerCase();
    const existingEntry = await UserUPIModel.findOne({ user_id, upi_id: upiIdNormalized });

    if (existingEntry) {
      if (existingEntry.status === "ACTIVE") {
        return NextResponse.json(
          { success: false, message: "User already has a registered same UPI." },
          { status: 400 }
        );
      } else if (existingEntry.status === "INACTIVE") {
        await UserUPIModel.deleteOne({ _id: existingEntry._id });
      }
    }

    const create_otp = generateOTP();

    const newUserBank = new UserUPIModel({
      user_id,
      user_email,
      upi_link_bank_name,
      upi_holder_name_aspr_upi,
      upi_id: upiIdNormalized,
      status: "INACTIVE",
      otp: create_otp,
    });

    const register_upi_document = await newUserBank.save();


    try {
      await upi_verify_email(create_otp, user_email);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return NextResponse.json(
        { success: false, message: "UPI added, but failed to send verification email." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "UPI details added successfully. Please verify your UPI.",
        id:register_upi_document._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding UPI details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add UPI details.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
