
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormTemplateModel from "@/model/ClaimFormTemplate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "Authentication required" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    const {
      store,   
      page = 1,
      limit = 20,
    } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = {};
    if (store) filters.store = store;

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const templates = await ClaimFormTemplateModel.find(filters)
      .populate("store", "name") 
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalRecords = await ClaimFormTemplateModel.countDocuments(filters);

    return NextResponse.json(
      {
        success: true,
        message: "Claim form templates retrieved successfully.",
        data: templates,
        pagination: {
          totalRecords,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalRecords / limitNumber),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching claim form templates:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
