

import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
  url: string;
  title: string;
  price: string;
  source: string;
  image: string;
  redirect_url: string;
  real_price?: string | null;
  main_container: string;
}

const PartnerSchema: Schema = new Schema(
  {
    url: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: String, required: true },
    source: { type: String, required: true },
    image: { type: String, required: true },
    redirect_url: { type: String, required: true },
    real_price: { type: String, default: null },
    main_container: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.ScraperPartner || mongoose.model<IPartner>('ScraperPartner', PartnerSchema);
