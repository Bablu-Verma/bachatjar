import mongoose, { Schema, Document } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AutoIncrementFactory = require("mongoose-sequence");

const AutoIncrement = AutoIncrementFactory(mongoose);

export interface ICashbackHistory {
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT";
  cashback_rate: string;
  start_date: Date;
  end_date?: Date;
  upto_amount?: number | null
}

export interface IStore extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  description: string;
  tc: string;
  tracking: string;
  slug: string;
  store_id?: number;
  store_img: string;
  cashback_status: "ACTIVE_CASHBACK" | "INACTIVE_CASHBACK";
  store_link: string;
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT";
  cashback_rate: number;
  cashback_history: ICashbackHistory[];
  store_status: "ACTIVE" | "INACTIVE" | "REMOVED";
  click_count?: number;
  upto_amount?:number | null,
  claim_form: 'ACTIVE_CLAIM_FORM' | 'INACTIVE_CLAIM_FORM'
}

const CashbackHistorySchema = new Schema<ICashbackHistory>({
  cashback_type: {
    type: String,
    enum: ["PERCENTAGE", "FLAT_AMOUNT"],
    required: true,
  },
  cashback_rate: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  upto_amount: { type: Number, default: null },
  end_date: {
    type: Date,
    default: null,
  },
});

const StoreSchema = new Schema<IStore>(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
      unique: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      index: true,
      ref: "Category",
      required: [true, "Category is required"],
    },
    store_id: {
      type: Number,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    store_img: {
      type: String,
      required: [true, "Image is required"],
    },
    cashback_status: {
      type: String,
      default: "ACTIVE_CASHBACK",
      enum: ["ACTIVE_CASHBACK", "INACTIVE_CASHBACK"],
    },
    store_link: {
      type: String,
      required: true,
    },
    cashback_type: {
      type: String,
      enum: ["PERCENTAGE", "FLAT_AMOUNT"],
      required: true,
    },
    cashback_rate: {
      type: Number,
      required: true,
    },
    cashback_history: {
      type: [CashbackHistorySchema],
      default: [],
    },
    store_status: {
      type: String,
      default: "ACTIVE",
      enum: ["ACTIVE", "INACTIVE", "REMOVED"],
    },
    tc: {
      type: String,
      required: [true, "Store terms & Conditions is required"],
      trim: true,
    },
    tracking: {
      type: String,
      required: [true, "Add Cashback tracking "],
      trim: true,
    },
    upto_amount: {
      type: Number,
      default: null,
    },
    click_count: {
      type: Number,
      default: 0,
    },
    claim_form:{
     type:String,
     default:'INACTIVE_CLAIM_FORM'
    }
  },
  { timestamps: true }
);

StoreSchema.plugin(AutoIncrement, {
  inc_field: "store_id",
  start_seq: 1,
});


const StoreModel =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default StoreModel;
