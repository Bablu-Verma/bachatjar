import mongoose, { Schema, Document } from "mongoose";

const STATUSES = [ "WITHDRAWAL_CREATE", "PENDING" ,  "APPROVED" , "REJECTED"] as const

export interface IWithdrawalRequest extends Document {
  user_id: mongoose.Types.ObjectId;
  amount: number;
  upi_id: string;
  status:(typeof STATUSES)[number];
  otp?:number,
  history: {
    status: (typeof STATUSES)[number];
    date: Date;
    details: string;
  }[];
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
    },
    upi_id: {
      type: String,
      required: true, 
      trim: true,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "WITHDRAWAL_CREATE",
    },
    history: [
      {
        status: { type: String, enum: STATUSES, required: true },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
      },
    ],
    otp:{
      type:Number,
      select: false,
    }
  },
  { timestamps: true }
);

const WithdrawalRequestModel =
  mongoose.models.WithdrawalRequest ||
  mongoose.model<IWithdrawalRequest>("WithdrawalRequest", WithdrawalRequestSchema);

export default WithdrawalRequestModel;
