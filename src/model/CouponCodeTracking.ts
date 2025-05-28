import mongoose, { Schema, Document } from "mongoose";

export interface ICouponTracking extends Document {
  coupon_code: string;  
  coupon_id: mongoose.Types.ObjectId;  
  copied_at: Date;  
  user_id?: mongoose.Types.ObjectId;  
  store_id: mongoose.Types.ObjectId; 
  ip_address?: string;  
  user_agent?: string;  
}

const CouponTrackingSchema = new Schema<ICouponTracking>(
  {
    coupon_code: {
      type: String,
      required: true,  
    },
    coupon_id: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    copied_at: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,  
    },
    store_id: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,  
    },
    ip_address: {
      type: String,
      required: false,  
    },
    user_agent: {
      type: String,
      required: false,  
    },
  },
  { timestamps: true }  
);

const CouponTrackingModel = mongoose.models.CouponTracking || mongoose.model<ICouponTracking>("CouponTracking", CouponTrackingSchema);

export default CouponTrackingModel;
