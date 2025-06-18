
import  { Schema, model, models, Document } from 'mongoose';


export interface INewsletter extends Document {
  email: string;
  unsubscribe: 'TRUE' | 'FALSE';
  createdAt: Date;
  updatedAt: Date;
}




const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    unsubscribe: {
      type: String,
      default: 'FALSE',
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter = models.Newsletter || model<INewsletter>('Newsletter', newsletterSchema);

export default Newsletter;
