import mongoose, { Schema, Document, model } from 'mongoose';

export interface ClientReport extends Document {
  click_id: string;
  raw_data: Record<string, unknown>;
  store: mongoose.Types.ObjectId;
  report_type: 'OFFLINE' | 'PINBACK' | 'MANUAL';
}

const ClientReportSchema: Schema<ClientReport> = new Schema(
  {
    click_id: {
      type: String,
      required: true,
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    report_type: {
      type: String,
      enum: ['OFFLINE', 'PINBACK', 'MANUAL'],
      required: true,
    },
     raw_data: {
      type: Schema.Types.Mixed,
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
