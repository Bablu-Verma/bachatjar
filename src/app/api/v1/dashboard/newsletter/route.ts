import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Newsletter from "@/model/Newsletter";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();
    const {
      unsubscribe = "",
      email = "",
      startDate = "",
      endDate = "",
      page = 1,
      limit = 50,
    } = body;


       const { authenticated, usertype, message } = await authenticateAndValidateUser(
          req
        );
        if (!authenticated) {
          return new NextResponse(JSON.stringify({ success: false, message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (usertype !== "admin") {
          return new NextResponse(
            JSON.stringify({ success: false, message: "Access denied: Does not have the required role" }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    if (unsubscribe !== "") {
      query.unsubscribe = unsubscribe;
    }

    if (email !== "") {
      query.email = { $regex: email, $options: "i" };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Query with pagination
    const [subscribers, total] = await Promise.all([
      Newsletter.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Newsletter.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Filtered data retrieved",
        data: subscribers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch subscribers",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
