// models/Message.ts
import  mongoose, { Document, Schema, model, models } from "mongoose";

export interface IMessage extends Document {
  _id:mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId; 
  title: string;
  body: string;
  read: 'FALSE' | 'TRUE';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: String, default: 'FALSE' },
  },
  { timestamps: true }
);

export default models.Message || model<IMessage>("Message", messageSchema);
