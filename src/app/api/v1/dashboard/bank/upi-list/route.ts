
import { authenticateAndValidateUser } from "@/lib/authenticate";

import dbConnect from "@/lib/dbConnect";
import UserUPIModel from "@/model/UserUPIModel";

import { NextResponse } from "next/server";

// Verify valid user
export async function POST(request: Request) {
  await dbConnect();

  const { authenticated, usertype, message } =
    await authenticateAndValidateUser(request);

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

  if (usertype !== "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Access denied: You do not have the required role",
      },
      { status: 403 }
    );
  }

  try {
    const {
      upi_id,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};

    if (upi_id) {
      filters.upi_id = upi_id;
    }

    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filters.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filters.createdAt = { $lte: new Date(endDate) };
    }

    const upiDocuments = await UserUPIModel.find(filters)
      .select(' -otp ')
      .populate("user_id", "name email profile phone")
      .skip((page - 1) * limit)
      .limit(parseInt(limit)).lean();

    const totalRecords = await UserUPIModel.countDocuments(filters);

    return NextResponse.json(
      {
        success: true,
        message: "UPI details fetched successfully",
        data: upiDocuments,
        pagination: {
          totalRecords,
          totalPages: Math.ceil(totalRecords / limit),
          currentPage: page,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fatching upi:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "Failed to fatch upi",
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
