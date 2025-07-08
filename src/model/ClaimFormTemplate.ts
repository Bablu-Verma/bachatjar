import mongoose, { Schema, Document } from "mongoose";

export interface IClaimField {
  label: string;
  type: "text" | "number" | "date" | "file";
  required: boolean;
  options?: string[];
}

export interface IClaimFormTemplate extends Document {
  store: mongoose.Types.ObjectId;
  fields: IClaimField[];
}

const ClaimFieldSchema = new Schema<IClaimField>(
  {
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "number", "date", "file"],
      required: true,
    },
    required: { type: Boolean, default: false },
    options: {
      type: [String],
      default: undefined,
    },
  },
  { _id: false } 
);

const ClaimFormTemplateSchema = new Schema<IClaimFormTemplate>({
  store: {
    type: mongoose.Types.ObjectId,
    ref: "Store",
    required: true,
    unique: true,
  },
  fields: {
    type: [ClaimFieldSchema],
    required: true,
    default: [],
  },
});

const ClaimFormTemplateModel =
  mongoose.models.ClaimFormTemplate ||
  mongoose.model<IClaimFormTemplate>(
    "ClaimFormTemplate",
    ClaimFormTemplateSchema
  );

export default ClaimFormTemplateModel;
