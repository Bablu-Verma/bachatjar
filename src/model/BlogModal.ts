import { blog_type } from '@/constant';
import mongoose, { Schema, model } from 'mongoose';

export type BlogType = 'Article' | 'Tutorial' | 'Case Study' | 'Review' | 'Interview';
export type BlogStatus = 'ACTIVE' | 'INACTIVE' | 'REMOVED';

export interface IBlog {
  title: string;
  slug: string;
  short_desc: string;
  desc: string;
  blog_category: mongoose.Types.ObjectId;
  blog_type: BlogType;
  image: string[];
  tags?: string[];
  views: number;
  writer_id: mongoose.Types.ObjectId;
  reading_time?: number;
  keywords: string[];
  publish_schedule?: Date;
  status: BlogStatus;
  // SEO Fields
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  canonical_url?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_card?: 'summary' | 'summary_large_image';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema_markup?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    short_desc: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    blog_category: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref:'BlogCategory'
    },
    blog_type: {
      type: String,
      required: true,
      enum: blog_type,
    },
    image: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
    },
    views: {
      type: Number,
      default: 0,
    },
    writer_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref:'User'
    },
    reading_time: {
      type: Number,
      default: 0,
    },
    keywords: {
      type: [String],
      default: [],
    },
    publish_schedule: {
      type: Date,
    },
  
    status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'INACTIVE', 'REMOVED'],
    },
   
    // SEO Fields
    meta_title: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters'],
    },
    meta_description: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    meta_keywords: {
      type: [String],
      default: [],
    },
    canonical_url: {
      type: String,
    },
    og_image: {
      type: String,
    },
    og_title: {
      type: String,
    },
    og_description: {
      type: String,
    },
    twitter_card: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image',
    },
    schema_markup: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);



const BlogModel = mongoose.models.Blog || model<IBlog>('Blog', BlogSchema);

export default BlogModel;
