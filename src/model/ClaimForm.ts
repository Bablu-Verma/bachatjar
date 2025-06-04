import mongoose, { Schema, Document, Model } from "mongoose";

// Define Claim Statuses
const CLAIM_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;

interface IClaimForm extends Document {
  user_id: mongoose.Types.ObjectId;
  store_id: Schema.Types.ObjectId;
  transaction_id:string;
  reason: string;
  supporting_documents: string[]; 
  status: typeof CLAIM_STATUSES[number]; 
  partner_site_orderid: string;
  partner_site_order_status: string;
  createdAt?: Date;
  updatedAt?: Date;
  product_order_date:Date;
  product_delever_date?: Date | null;
  order_value:number
}

const ClaimFormSchema = new Schema<IClaimForm>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    store_id: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    transaction_id: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
     
    },
    supporting_documents: {
      type: [String],
      required: true,
      validate: {
        validator: function (val: string[]) {
          return Array.isArray(val) && val.length > 0;
        },
        message: "At least one supporting document is required.",
      },
    },
    status: {
      type: String,
      enum: CLAIM_STATUSES,
      default: "PENDING",
    },
    partner_site_orderid: {
      type: String,
      required: true,
      trim: true,
    },
    partner_site_order_status: {
      type: String,
      required: true,
      trim: true,
    },
    product_order_date: {
      type: Date,
      required: true,
    },
    product_delever_date: {
      type: Date,
      required: false,
      default: null,
    },
    order_value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export ClaimForm Model
const ClaimFormModel: Model<IClaimForm> =
  mongoose.models.ClaimForm || mongoose.model<IClaimForm>("ClaimForm", ClaimFormSchema);

export default ClaimFormModel;
