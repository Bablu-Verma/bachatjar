import mongoose, { Schema, Document } from "mongoose";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AutoIncrementFactory = require("mongoose-sequence");
const AutoIncrement = AutoIncrementFactory(mongoose);

// -------------------- INTERFACES -------------------- //

export interface ICashbackHistory {
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT";
  cashback_rate: string;
  start_date: Date;
  end_date?: Date;
  upto_amount?: number | null;
  min_amount?: number | null;
}

export interface IStore extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  description: string;
  tc: string;
  tracking?: string | null;
  slug: string;
  store_id?: number;
  store_img: string;
  store_link: string;
  cashback_rate: number ;
  cashback_history?: ICashbackHistory[] | null;
  click_count?: number;
  upto_amount?: number | null;
  min_amount?: number | null;
  store_status: "ACTIVE" | "INACTIVE" | "REMOVED";
  store_type: "INSENTIVE" | "NON_INSENTIVE";
  cashback_type: "PERCENTAGE" | "FLAT_AMOUNT" ;
  claim_form: "ACTIVE_CLAIM_FORM" | "INACTIVE_CLAIM_FORM";
}

// -------------------- SCHEMAS -------------------- //

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
  end_date: {
    type: Date,
    default: null,
  },
  upto_amount: {
    type: Number,
    default: null,
  },
  min_amount: {
    type: Number,
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
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Store description is required"],
      trim: true,
    },
    tc: {
      type: String,
      required: [true, "Store terms & conditions are required"],
      trim: true,
    },
    tracking: {
      type: String,
      required: function (this: IStore) {
        return this.store_type === "INSENTIVE";
      },
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    store_id: {
      type: Number,
      unique: true,
    },
    store_img: {
      type: String,
      required: [true, "Image is required"],
    },
    store_type: {
      type: String,
      enum: ["INSENTIVE" , "NON_INSENTIVE"],
      required: [true, "store_type is required"],
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
      required: function (this: IStore) {
        return this.store_type === "INSENTIVE";
      },
    },
    upto_amount: {
      type: Number,
      default: null,
    },
    min_amount: {
      type: Number,
      default: null,
    },
    store_status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "REMOVED"],
      default: "ACTIVE",
    },
    click_count: {
      type: Number,
      default: 0,
    },
    claim_form: {
      type: String,
      enum: ["ACTIVE_CLAIM_FORM", "INACTIVE_CLAIM_FORM"],
      default: "INACTIVE_CLAIM_FORM",
    },
  },
  { timestamps: true }
);

// Auto-increment plugin
StoreSchema.plugin(AutoIncrement, {
  inc_field: "store_id",
  start_seq: 1,
});

// -------------------- MODEL EXPORT -------------------- //

const StoreModel =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default StoreModel;
