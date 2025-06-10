import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/UserModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";


export async function POST(req: Request) {
  await dbConnect();

  try {
    // Authenticate Admin
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json(
        { success: false, message: message || "User is not authenticated" },
        { status: 401 }
      );
    }

    if (usertype !== "admin") {
      return NextResponse.json(
        { success: false, message: "Access denied: Only admin can access user list" },
        { status: 403 }
      );
    }

   const requestdata  = await req.json();

    const {
      page = 1,
      limit = 20,
      search,
      role,
      status,
      gender,
      startDate,
      endDate,
    } = requestdata
    // console.log(requestdata)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};

    const validRoles = ["user", "admin", "data_editor", "blog_editor"];
    if (role && validRoles.includes(role)) {
      query.role = role;
    }

    const validStatuses = ["ACTIVE", "REMOVED"];
    if (status && validStatuses.includes(status)) {
      query.user_status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, 
        { email: { $regex: search, $options: "i" } },
      ];
    }

   
    if (gender) {
      query.gender = gender;
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

  
    const users = await UserModel.find(query)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(pageSize)
      .select("-password"); 

    // Total Users Count (for pagination)
    const totalUsers = await UserModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message: "User list fetched successfully.",
        data: users,
        pagination: {
          totalUsers,
          totalPages: Math.ceil(totalUsers / pageSize),
        },
      },
      { status: 200 }
    );
  }catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch user list:", error.message);
      return new NextResponse(
        JSON.stringify({ success: false, message: "Failed to fetch user list.", error: error.message }),
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
