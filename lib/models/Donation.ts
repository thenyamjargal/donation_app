import mongoose, { Schema, Document } from "mongoose";

export interface IDonationDocument extends Document {
  amount: number;
  creatorSlug: string;
  supporterName?: string;
  message?: string;
  isAnonymous: boolean;
  status: "pending" | "paid" | "failed";
  telegramNotified: boolean;
  statusToken: string;
  invoice_id: string;
  invoice_desc: string;
  qr_image?: string;
  qr_text?: string;
  urls?: Array<{ name: string; description: string; logo: string; link: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonationDocument>(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [1000, "Minimum amount is 1000"],
    },
    creatorSlug: {
      type: String,
      required: [true, "Creator slug is required"],
      trim: true,
    },
    supporterName: {
      type: String,
      trim: true,
      maxlength: [100, "Supporter name must be 100 characters or less"],
    },
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message must be 500 characters or less"],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
    },
    telegramNotified: {
      type: Boolean,
      default: false,
    },
    statusToken: {
      type: String,
      required: [true, "Status token is required"],
      index: true,
    },
    invoice_id: {
      type: String,
      required: [true, "Invoice ID is required"],
      trim: true,
      index: true,
    },
    invoice_desc: {
      type: String,
      required: [true, "Invoice description is required"],
      trim: true,
    },
    qr_image: {
      type: String,
    },
    qr_text: {
      type: String,
    },
    urls: [
      {
        name: { type: String },
        description: { type: String },
        logo: { type: String },
        link: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

DonationSchema.index({ status: 1, createdAt: -1 });
DonationSchema.index({ creatorSlug: 1, createdAt: -1 });

export const Donation =
  mongoose.models.Donation ||
  mongoose.model<IDonationDocument>("Donation", DonationSchema);
