import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ContactUsModel from "@/model/ContactUsModel";
import { authenticateAndValidateUser } from "@/lib/authenticate";

export async function POST(req: Request) {
  await dbConnect();

  try {

     const { authenticated, usertype, message } =
         await authenticateAndValidateUser(req);
   
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
   
       const { id, action_status } = await req.json();

       if (!id || !action_status) {
         return new NextResponse(
           JSON.stringify({ success: false, message: "Both ID and action_status are required." }),
           { status: 400, headers: { "Content-Type": "application/json" } }
         );
       }
   
       // Find and update the ContactUs record
       const updatedRecord = await ContactUsModel.findByIdAndUpdate(
         id,
         { action_status },
         { new: true }
       );
   
       if (!updatedRecord) {
         return new NextResponse(
           JSON.stringify({ success: false, message: "Contact Us record not found." }),
           { status: 404, headers: { "Content-Type": "application/json" } }
         );
       }
   
       return new NextResponse(
         JSON.stringify({ success: true, message: "Action status updated successfully." }),
         { status: 200, headers: { "Content-Type": "application/json" } }
       );

  

   
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting Contact Us record:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to delete Contact Us record.",
          error: error.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
