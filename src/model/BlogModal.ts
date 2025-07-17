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
  createdAt?: Date;
  updatedAt?: Date;

  liked_by?: mongoose.Types.ObjectId[];     
  disliked_by?: mongoose.Types.ObjectId[];  

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
     liked_by: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
    disliked_by: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    }],
  },
  { timestamps: true }
);



const BlogModel = mongoose.models.Blog || model<IBlog>('Blog', BlogSchema);

export default BlogModel;
