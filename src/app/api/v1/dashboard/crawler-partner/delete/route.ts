import dbConnect from '@/lib/dbConnect';
import { authenticateAndValidateUser } from '@/lib/authenticate';
import { NextResponse } from 'next/server';
import ScraperPartner from '@/model/ScraperPartner';


export async function POST(req: Request) {
  try {
    await dbConnect();

    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({ success: false, message: message || "User is not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (usertype !== "admin") {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Access denied: You do not have the required role" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const { id } = await req.json();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing 'id' in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const deleted = await ScraperPartner.findByIdAndDelete(id);

    if (!deleted) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Partner not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: true, message: "Partner deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Failed to delete partner ❌", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
