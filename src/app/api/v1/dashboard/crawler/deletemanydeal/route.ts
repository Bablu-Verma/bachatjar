import LiveDealModel from '@/model/LiveDeal';
import dbConnect from '@/lib/dbConnect';
import { authenticateAndValidateUser } from '@/lib/authenticate';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
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

    const body = await req.json();
    const { skipCount = 0 } = body;

    // Sort by create_date in ascending order to get the oldest (last added) items
    const dealsToDelete = await LiveDealModel.find({})
      .sort({ create_date: 1 })  // Ascending: oldest first
      .skip(skipCount)
      .limit(10);

    const idsToDelete = dealsToDelete.map(deal => deal._id);

    const deleteResult = await LiveDealModel.deleteMany({ _id: { $in: idsToDelete } });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: `Deleted ${deleteResult.deletedCount} deals`,
        deletedIds: idsToDelete
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Bulk delete failed ❌", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
