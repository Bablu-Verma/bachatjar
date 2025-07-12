// models/Referral.ts
import mongoose, { Schema, model, models } from "mongoose";


export interface IReferral extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug?: string;
  description: string;
  referralLink: string;
  imageUrl?: string;
  rewardForUser?: string;
  category: mongoose.Types.ObjectId; 
  status: "ACTIVE" | "PAUSE" | "DELETE";
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema = new Schema<IReferral>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
    },
    referralLink: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    rewardForUser: {
      type: String,
      default: '',
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Category is required"],
      index: true,
      ref: "Category",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "PAUSE", "DELETE"],
      default: "ACTIVE",
      required: [true, "Product status is required"],
    },
  },
  { timestamps: true }
);

export default models.Referral || model<IReferral>('Referral', referralSchema);
