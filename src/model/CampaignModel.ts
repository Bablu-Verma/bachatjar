import mongoose, { Schema } from "mongoose";

export interface ICampaign {

  title: string;
  _id: string;
  slug_type: "INTERNAL" | "EXTERNAL";
  user_id: mongoose.Types.ObjectId;
  actual_price: number;
  offer_price: number;
  calculated_cashback: number;
  store: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  description?: string;
  product_img: string;
  product_tags: ("new" | "hot" | "best" | "live")[];
  long_poster: { is_active: boolean; image: string }[];
  main_banner: { is_active: boolean; image: string }[];
  premium_product: { is_active: boolean; image: string }[];
  flash_sale: { is_active: boolean; image: string; end_time: string }[];
  t_and_c?: string;
  product_slug: string;
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  meta_robots?: "index, follow" | "noindex, nofollow";
  canonical_url?: string;
  structured_data?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  product_status: "ACTIVE" | "PAUSE" | "DELETE";
  createdAt?: Date;
  updatedAt?: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {


    title: { type: String, required: [true, "Title is required"] },

    slug_type: {
      type: String,
      enum: ["INTERNAL", "EXTERNAL"],
      default: "INTERNAL",
    },

    user_id: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      index: true,
      ref: "User",
    },

    actual_price: { type: Number, required: [true, "Actual price is required"] },

    offer_price: { type: Number, required: [true, "Offer price is required"] },

    calculated_cashback: {
      type: Number,
      required: [true, "Calculated cashback is required"],
    },

    store: {
      type: Schema.Types.ObjectId,
      required: [true, "Store is required"],
      index: true,
      ref: "Store",
    },

    category: {
      type: Schema.Types.ObjectId,
      required: [true, "Category is required"],
      index: true,
      ref: "Category",
    },

    description: { type: String, required: false },

    product_img: {
      type: String,
      required: [true, "Product image is required"],
    },

    product_tags: {
      type: [String],
      enum: ["new", "hot", "best", "live"],
      default: [],
    },

    long_poster: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String, required: false },
        },
      ],
      default: [],
      validate: {
        validator: function (value: { is_active: boolean; image: string }[]) {
          return value.every((item) => !item.is_active || !!item.image);
        },
        message: "Image is required when long_poster is active",
      },
    },

    main_banner: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String, required: false },
        },
      ],
      default: [],
      validate: {
        validator: function (value: { is_active: boolean; image: string }[]) {
          return value.every((item) => !item.is_active || !!item.image);
        },
        message: "Image is required when main_banner is active",
      },
    },

    premium_product: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String, required: false },
        },
      ],
      default: [],
      validate: {
        validator: function (value: { is_active: boolean; image: string }[]) {
          return value.every((item) => !item.is_active || !!item.image);
        },
        message: "Image is required when premium_product is active",
      },
    },

    flash_sale: {
      type: [
        {
          is_active: { type: Boolean, default: false },
          image: { type: String, required: false },
          end_time: { type: String, required: false },
        },
      ],
      default: [],
      validate: {
        validator: function (
          value: { is_active: boolean; image: string; end_time: string }[]
        ) {
          return value.every(
            (item) => !item.is_active || (!!item.image && !!item.end_time)
          );
        },
        message: "Image and end_time are required when flash_sale is active",
      },
    },

    t_and_c: { type: String, required: false },

    product_slug: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // Allows unique on optional field
    },

    tags: { type: [String], required: false },

    meta_title: { type: String, required: false },

    meta_description: { type: String, required: false },

    meta_keywords: { type: [String], required: false },

    meta_robots: {
      type: String,
      enum: ["index, follow", "noindex, nofollow"],
      required: false,
    },

    canonical_url: { type: String, required: false },

    structured_data: { type: String, required: false },

    og_image: { type: String, required: false },

    og_title: { type: String, required: false },

    og_description: { type: String, required: false },

    product_status: {
      type: String,
      enum: ["ACTIVE", "PAUSE", "DELETE"],
      default: "ACTIVE",
      required: [true, "Product status is required"],
    },
  },
  { timestamps: true }
);

const CampaignModel =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default CampaignModel;
