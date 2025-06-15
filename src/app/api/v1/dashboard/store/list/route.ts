import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
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
            {
              status: 401,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
    
        if (!(usertype === "admin" || usertype === "data_editor")) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "Access denied: You do not have the required role",
            }),
            {
              status: 403,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
   
    const {
      page = 1,
      limit = 30,
      search,
      store_type,
      cashback_type,
      store_id,
      store_status,
      startDate,
      endDate,
    } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    // Filter: Cashback Status
    if (store_type && ["INSENTIVE" , "NON_INSENTIVE"].includes(store_type)) {
      query.store_type = store_type;
    }

    // Filter: Cashback Type
    if (cashback_type && ["PERCENTAGE", "FLAT_AMOUNT"].includes(cashback_type)) {
      query.cashback_type = cashback_type;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Filter: Store ID
    if (store_id) {
      query.store_id = store_id;
    }

    // Filter: Store Status (Only apply if not "ALL")
    if (store_status && store_status !== "ALL") {
      if (["ACTIVE", "INACTIVE", "REMOVED"].includes(store_status)) {
        query.store_status = store_status;
      }
    }

    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate); 
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate); 
      }
    }

   
    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Fetch Stores with Filtering, Pagination & Sorting
    const stores = await StoreModel.find(query)
      .skip(skip)
      .populate('category', 'name category')
      .select('-description -tc')
      .limit(pageSize)
      .sort({ createdAt: -1 });

    // Count Total Matching Stores
    const totalStores = await StoreModel.countDocuments(query);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Store list fetched successfully.",
        data: stores,
        pagination:{
        totalPages: Math.ceil(totalStores / pageSize),
       }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch store list:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch store list.", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({ success: false, message: "An unexpected error occurred." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
