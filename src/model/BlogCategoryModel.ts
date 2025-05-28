import mongoose, { Schema } from "mongoose";

export interface IBCategory {
   _id: mongoose.Schema.Types.ObjectId, 
  name: string;
  description: string;
  slug: string;
  imges: string[]; 
  status: "ACTIVE" | "INACTIVE" | "REMOVED"; 
 
}

const BlogCategorySchema = new Schema<IBCategory>(
  {
    name: {
      type: String,
      required: [true, "blog Category name is required"],
      unique: true, 
      trim: true, 
    },
    description: {
      type: String,
      required: [true, "blog Category description is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "blog Slug is required"],
      unique: true, 
      lowercase: true,
      trim: true,
    },
    imges:[{type: String},{type: String}],
    status: {
        type:String,
        default: 'ACTIVE', 
        enum: ['ACTIVE', 'INACTIVE', 'REMOVED'],
    },
  },
  { timestamps: true } 
);


const BlogCategoryModel = mongoose.models.BlogCategory || mongoose.model<IBCategory>("BlogCategory", BlogCategorySchema);

export default BlogCategoryModel;
