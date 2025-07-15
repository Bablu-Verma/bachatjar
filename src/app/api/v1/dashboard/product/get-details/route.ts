import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CampaignModel from "@/model/CampaignModel";
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
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }
    
        if (!(usertype === "admin" || usertype === "data_editor")) {
          return new NextResponse(
            JSON.stringify({
              success: false,
              message: "Access denied: You do not have the required role",
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
    


    const { product_slug } = await req.json(); 

    if (!product_slug) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product slug is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Filter condition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: any = { product_slug };

 

    const product = await CampaignModel.findOne(filters).populate('store', 'name cashback_type cashback_rate store_link store_type store_img')
    .populate('category', 'name slug');

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Product not found.",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Product details retrieved successfully.",
        data: product
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to retrieve product details:", error.message);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Failed to retrieve product details.",
          error: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "An unexpected error occurred.",
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
}
