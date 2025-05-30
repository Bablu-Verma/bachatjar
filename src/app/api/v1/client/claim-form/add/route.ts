import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import ClaimFormModel from "@/model/ClaimForm";


export async function POST(req: Request) {
  await dbConnect();

  try {
   
    const { authenticated, user, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: message || "User is not authenticated",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();

    const store_id = formData.get("store_id")?.toString();
    const transaction_id = formData.get("transaction_id")?.toString();
    const reason = formData.get("reason")?.toString();
    const partner_site_orderid = formData.get("partner_site_orderid")?.toString();
    const partner_site_order_status = formData.get("partner_site_order_status")?.toString();
    const product_order_date = formData.get("product_order_date") ? new Date(formData.get("product_order_date")!.toString()) : undefined;
    const product_delever_date_raw = formData.get("product_delever_date")?.toString();
    const product_delever_date = product_delever_date_raw ? new Date(product_delever_date_raw) : null;
    const order_value = formData.get("order_value") ? Number(formData.get("order_value")) : undefined;

   
    const supporting_documents = formData.getAll("supporting_documents");

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
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    if (!supporting_documents.length) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "At least one image is required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const uploaded_urls: string[] = [];

    // for (const image_ of supporting_documents) {
    //   if (image_ instanceof File) {
    //     const { success, message, url } = await upload_image(
    //       image_,
    //     );
  
    //     if (success && url) {
    //       uploaded_urls.push(url);
    //     } else {
    //       console.error("Image upload failed:", message);
    //     }
    //   } else {
    //     console.error("Invalid image value. Expected a File.");
    //   }
    // }


    // Create Claim
    const newClaim = new ClaimFormModel({
      user_id: user?._id,
      store_id,
      transaction_id,
      reason,
      supporting_documents:uploaded_urls,
      partner_site_orderid,
      partner_site_order_status,
      product_order_date,
      product_delever_date:product_delever_date ?? null,
      order_value,
    });

    await newClaim.save();

    return NextResponse.json(
      {
        success: true,
        message: "Claim submitted successfully.",
       
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting claim:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
