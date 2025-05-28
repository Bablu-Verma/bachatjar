import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactUsModel from "@/model/ContactUsModel";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneNumberRegex = /^[0-9]{10}$/; 

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, email, subject, message, phone_number, location } = await req.json();

    
    if (!name || !email || !subject || !message) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Name, email, subject, and message are required.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

   
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please provide a valid email address.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (phone_number && !phoneNumberRegex.test(phone_number)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Please provide a valid phone number.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create new contact request
    const newContactRequest = new ContactUsModel({
      name,
      email,
      subject,
      message,
      phone_number,
      location,
    });

    // Save to the database
    await newContactRequest.save();

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Contact request submitted successfully.",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error submitting contact request:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to submit contact request.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
