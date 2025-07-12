import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClientReport from "@/model/ClientReport";
import '@/model/StoreModel'

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(JSON.stringify({
        success: false,
        message: message || "User is not authenticated",
      }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (usertype !== "admin") {
      return new NextResponse(JSON.stringify({
        success: false,
        message: "Access denied: You do not have the required role",
      }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requestData = await req.json();
    const {
      click_id,
      store_id,
      report_type,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = requestData;

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (click_id) query.click_id = click_id;
    if (store_id) query.store_id = store_id;
    if (report_type) query.report_type = report_type;

    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }

    const skip = (page - 1) * limit;

    const clientRecords = await ClientReport.find(query)
      .skip(skip)
      .limit(limit)
      .populate("store", "name") // ✅ This works now
      .lean();

    const totalDocuments = await ClientReport.countDocuments(query);
    const totalPages = Math.ceil(totalDocuments / limit);

    return new NextResponse(JSON.stringify({
      success: true,
      message: "clint records retrieved successfully.",
      data: clientRecords,
      pagination: {
        currentPage: page,
        totalPages,
        totalDocuments,
        limit,
      },
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Error fetching Contact Us records:", error);
    return new NextResponse(JSON.stringify({
      success: false,
      message: "Failed to fetch client records.",
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
