import mongoose, { Schema, Document } from "mongoose";

export interface IConformAmount extends Document {
  _id: string;
  user_id: mongoose.Types.ObjectId;
  amount: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  hold_amount?: number
}

const ConformAmountSchema = new Schema<IConformAmount>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    hold_amount: {
      type: Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

const ConformAmountModel =
  mongoose.models.ConformAmount ||
  mongoose.model<IConformAmount>("ConformAmount", ConformAmountSchema);

export default ConformAmountModel;
