import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactUsModel from "@/model/ContactUsModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    // ✅ Authenticate User
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

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Access denied: You do not have the required role",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

   
    const requestData = await req.json();
    const {
      name,
      email,
      phone_number,
      startDate,
      endDate,
      action_status,
      page = 1,
      limit = 10,
    } = requestData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // ✅ Name filter (Case-insensitive search)
    if (name) query.name = { $regex: name, $options: "i" };

    // ✅ Email filter (Case-insensitive search)
    if (email) query.email = { $regex: email, $options: "i" };
    if (action_status) query.action_status = action_status

    // ✅ Phone number exact match
    if (phone_number) query.phone_number = phone_number;

    // ✅ Date range filtering
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    // ✅ Pagination
    const skip = (page - 1) * limit;

    const contactUsRecords = await ContactUsModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    // ✅ Get total count for pagination
    const totalDocuments = await ContactUsModel.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Contact Us records retrieved successfully.",
        data: contactUsRecords,
        pagination: {
          currentPage: page,
          totalPages,
          totalDocuments,
          limit,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error fetching Contact Us records:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fetch Contact Us records.",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
