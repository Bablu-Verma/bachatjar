import mongoose, { Schema, Document, model } from 'mongoose';

export interface ClientReport extends Document {
  click_id: string;
  order_id?: string;
  status?: string;
  amount: number;
  commission: number;
  raw_data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  store: mongoose.Types.ObjectId;
  report_type: 'OFFLINE' | 'PINBACK';
}

const ClientReportSchema: Schema<ClientReport> = new Schema(
  {
    click_id: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
    },
    status: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    raw_data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    report_type: {
      type: String,
      enum: ['OFFLINE', 'PINBACK'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Optional: avoid recompiling model in dev environments
export default mongoose.models.ClientReport ||
  model<ClientReport>('ClientReport', ClientReportSchema);
