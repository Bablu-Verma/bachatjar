import mongoose, { Schema, Document, Model } from "mongoose";


const STATUSES = ["Initialize","Pending", "Confirmed", "Failed"] as const;

interface IHistory {
  status: string;
  date: Date;
  details: string;
}

export interface IOrder extends Document {
  user_id: mongoose.Types.ObjectId;
  store_id: mongoose.Types.ObjectId;
  redirect_url: string;
  order_create:Date;
  order_value?: number | null;
  cashback_rate: number;
  cashback?: number | null;
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT";
  transaction_id: string;
  payment_status: (typeof STATUSES)[number];
  upto_amount?: number | null;
  payment_history: IHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    upto_amount:{
     type:Number || null,
     default:null
    }, 
    order_create:{
      type:Date,
      default: Date.now
    },
    redirect_url: {
      type: String,
    },
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Store",
      index: true,
    },
    transaction_id: {
      type: String,
      unique: true,
      required: true,
    },
    order_value: { type: Number, default: null, required: false },
    cashback: { type: Number, default: null, required: false },
    cashback_rate: { type: Number, required: true },
    cashback_type: {
      type: String,
      enum: ["PERCENTAGE", "FLAT_AMOUNT"],
      required: true,
    },
  
    payment_status: {
      type: String,
      enum: STATUSES,
      default: null,
    },
    payment_history: [
      {
        status: { type: String, enum: STATUSES, required: true },
        date: { type: Date, default: Date.now },
        details: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);


const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
