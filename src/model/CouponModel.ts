import mongoose, { Schema, model } from "mongoose";
export type CouponStatus = "ACTIVE" | "INACTIVE" | "REMOVED";

export interface ICoupon {
  _id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  expiry_date: Date;
  store: mongoose.Types.ObjectId;
  category:mongoose.Types.ObjectId;
  status: CouponStatus;
}

const CouponSchema = new Schema<ICoupon>(
  {
    title: {
      type: String,
      required: [true, "Coupon title"]
    },
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      trim: true,
    },
    discount: {
      type: String,
      required: [true, "Discount value is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    expiry_date: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "REMOVED"],
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.models.Coupon || model<ICoupon>("Coupon", CouponSchema);

export default CouponModel;
