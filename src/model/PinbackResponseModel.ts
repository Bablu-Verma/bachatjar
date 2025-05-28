/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Document, Model } from "mongoose";

// Interface
export interface PinbackResponse extends Document {
click_id: string;
  transaction_id?: string;
  status?: string;
  amount: number;
  commission: number;
  source?: string;
  raw_data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

const pinbackResponseSchema = new mongoose.Schema<PinbackResponse>(
  {
    click_id: { type: String, required: true,  unique: true,},
    transaction_id: { type: String },
    status: { type: String },
    amount: { type: Number, required: true },
    commission: { type: Number, required: true },
    source: { type: String },
    raw_data: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);


const PinbackResponseModel: Model<PinbackResponse> =
  mongoose.models.PinbackResponse || mongoose.model<PinbackResponse>("PinbackResponse", pinbackResponseSchema);

export default PinbackResponseModel;
