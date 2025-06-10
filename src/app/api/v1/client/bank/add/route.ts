import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import UserUPIModel from "@/model/UserUPIModel";
import { generateOTP } from "@/helpers/server/server_function";
import { upi_verify_email } from "@/email/user_upi_verify";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate user
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated || !user || !user._id || !user.email) {
      return NextResponse.json(
        { success: false, message: message || "User is not authenticated" },
        { status: 401 }
      );
    }

    const { upi_link_bank_name, upi_holder_name_aspr_upi, upi_id } = await req.json();

    // Validate fields
    if (!upi_link_bank_name || !upi_holder_name_aspr_upi || !upi_id) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const user_id = user?._id;
    const user_email = user.email;
    const upiIdNormalized = upi_id.trim().toLowerCase();

    const upiExists = await UserUPIModel.findOne({ upi_id: upiIdNormalized });

    if (upiExists) {
      if (upiExists.user_id.toString() === user_id.toString()) {
        // Same user — cleanup if INACTIVE
        if (upiExists.status === "INACTIVE") {
          await UserUPIModel.deleteOne({ _id: upiExists._id });
        } else {
          return NextResponse.json(
            { success: false, message: "This UPI is already registered." },
            { status: 400 }
          );
        }
      } else {
        // UPI belongs to another user
        return NextResponse.json(
          { success: false, message: "This UPI ID is already registered by another user." },
          { status: 400 }
        );
      }
    }

    const create_otp = generateOTP();

    // Create new UPI entry
    const newUserUPI = new UserUPIModel({
      user_id,
      user_email,
      upi_link_bank_name,
      upi_holder_name_aspr_upi,
      upi_id: upiIdNormalized,
      status: "INACTIVE",
      otp: create_otp,
    });

    const savedUPI = await newUserUPI.save();

    try {
      await upi_verify_email(create_otp, user_email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return NextResponse.json(
        {
          success: false,
          message: "UPI saved but verification email failed to send.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "UPI details added. Please verify your UPI.",
        id: savedUPI._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding UPI:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add UPI.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
