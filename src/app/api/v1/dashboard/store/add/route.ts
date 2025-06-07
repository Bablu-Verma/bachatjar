import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/StoreModel";
import { generateSlug } from "@/helpers/client/client_function";
import { authenticateAndValidateUser } from "@/lib/authenticate";
import CategoryModel from "@/model/CategoryModel";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { authenticated, usertype, message } = await authenticateAndValidateUser(req);

    if (!authenticated) {
      return NextResponse.json({ success: false, message: message || "User not authenticated" }, { status: 401 });
    }

    if (usertype !== "admin") {
      return NextResponse.json({ success: false, message: "Access denied: Admins only" }, { status: 403 });
    }

    const requestData = await req.json();
    const {
      name,
      description,
      store_img,
      category,
      tc,
      tracking,
      store_link,
      cashback_type,
      cashback_rate,
      store_status,
      upto_amount,
      min_amount,
      claim_form,
      store_type,
    } = requestData;

    // Validate required fields
    if (
      !name || !description || !store_img || !store_link || !category || !tc ||
      !cashback_type || cashback_rate === undefined || !store_type
    ) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    // Validate store_type
    if (!["INSENTIVE", "NON_INSENTIVE"].includes(store_type)) {
      return NextResponse.json({ success: false, message: "Invalid store type." }, { status: 400 });
    }

    // Validate category ID
    const categoryExists = await CategoryModel.findById(category);
    if (!categoryExists) {
      return NextResponse.json({ success: false, message: "Invalid category ID." }, { status: 400 });
    }

    const trimmedName = name.trim();
    const slug = generateSlug(trimmedName);

    const existingStore = await StoreModel.findOne({ $or: [{ name: trimmedName }, { slug }] });
    if (existingStore) {
      return NextResponse.json({ success: false, message: "Store with this name or slug already exists." }, { status: 400 });
    }

    const parsedCashbackRate = Number(cashback_rate);
    if (isNaN(parsedCashbackRate) || parsedCashbackRate <= 0) {
      return NextResponse.json({ success: false, message: "Cashback rate must be a valid number > 0." }, { status: 400 });
    }

    // Validate tracking and cashback history for INSENTIVE stores
    if (store_type === "INSENTIVE") {
      if (!tracking || tracking.trim() === "") {
        return NextResponse.json({ success: false, message: "Tracking info is required for INSENTIVE stores." }, { status: 400 });
      }
    }

    const storeData = {
      name: trimmedName,
      slug,
      description: description.trim(),
      tc: tc.trim(),
      store_img,
      category,
      store_link: store_link.trim(),
      store_type,
      cashback_type,
      cashback_rate: parsedCashbackRate,
      tracking: store_type === "INSENTIVE" ? tracking.trim() : null,
      cashback_history:
        store_type === "INSENTIVE"
          ? [{
              cashback_type,
              cashback_rate: parsedCashbackRate.toString(),
              start_date: new Date(),
              upto_amount: upto_amount ? Number(upto_amount) : null,
              min_amount: min_amount ? Number(min_amount) : null,
            }]
          : [],
      upto_amount: upto_amount ? Number(upto_amount) : null,
      min_amount: min_amount ? Number(min_amount) : null,
      store_status: store_status || "ACTIVE",
      claim_form: claim_form || "INACTIVE_CLAIM_FORM",
    };

    const newStore = new StoreModel(storeData);
    await newStore.save();

    return NextResponse.json(
      { success: true, message: "Store added successfully", store: newStore },
      { status: 201 }
    );
     // eslint-disable-next-line react-hooks/exhaustive-deps
  } catch (error) {
    console.error("Store creation error:", error);
    return NextResponse.json({ success: false, message: "Failed to create store.",  }, { status: 500 });
  }
}
