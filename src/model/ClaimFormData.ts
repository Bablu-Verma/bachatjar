import mongoose, { Schema, Document, Model } from "mongoose";

const CLAIM_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
type ClaimStatus = typeof CLAIM_STATUSES[number];


interface IClaimForm extends Document {
  user_id: mongoose.Types.ObjectId;
  store_id: mongoose.Types.ObjectId;
  transaction_id?: string | null;
  reason: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dynamic_fields?: Record<string, any>;
  status: ClaimStatus;
  createdAt?: Date;
  updatedAt?: Date;
}


// 📄 Main schema
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
      index: true,
      default: null,
    },
    reason: {
      type: String,
      required: true,
    },
     dynamic_fields: {
      type: Schema.Types.Mixed,  
      default: {},
    },
    status: {
      type: String,
      enum: CLAIM_STATUSES,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

// 🔁 Export model
const ClaimFormModel: Model<IClaimForm> =
  mongoose.models.ClaimForm || mongoose.model<IClaimForm>("ClaimForm", ClaimFormSchema);

export default ClaimFormModel;
