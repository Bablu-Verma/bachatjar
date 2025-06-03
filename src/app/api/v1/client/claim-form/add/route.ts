import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormModel from "@/model/ClaimForm";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated || !user) {
      return NextResponse.json(
        { success: false, message: message || "Authentication required" },
        { status: 401 }
      );
    }

    const formData = await req.json();

    const {
      store_id,
      transaction_id,
      reason,
      partner_site_orderid,
      partner_site_order_status,
      product_order_date,
      product_delever_date,
      order_value,
      supporting_documents
    } = formData;

    // Validate required fields
    if (
      !store_id ||
      !transaction_id ||
      !reason ||
      !partner_site_orderid ||
      !partner_site_order_status ||
      !product_order_date ||
      !order_value
    ) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    // Validate at least one image is provided
    if (!supporting_documents || supporting_documents.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one supporting document is required" },
        { status: 400 }
      );
    }

    // Validate all documents are URLs
    const invalidDocuments = supporting_documents.filter(
      (doc: string) => !doc.startsWith('http') && !doc.startsWith('/uploads/')
    );
    
    if (invalidDocuments.length > 0) {
      return NextResponse.json(
        { success: false, message: "Invalid document format" },
        { status: 400 }
      );
    }

    // Create new claim
    const newClaim = new ClaimFormModel({
      user_id: user._id,
      store_id,
      transaction_id,
      reason,
      supporting_documents,
      partner_site_orderid,
      partner_site_order_status,
      product_order_date: new Date(product_order_date),
      product_delever_date: product_delever_date ? new Date(product_delever_date) : null,
      order_value: Number(order_value),
      status: "PENDING"
    });

    await newClaim.save();

    return NextResponse.json(
      {
        success: true,
        message: "Claim submitted successfully",
        claimId: newClaim._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error submitting claim:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}