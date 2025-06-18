import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Newsletter from "@/model/Newsletter";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();

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

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const deletedSubscriber = await Newsletter.findOneAndDelete({ email });

    if (!deletedSubscriber) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Subscriber deleted successfully",
        data: deletedSubscriber,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete subscriber",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
