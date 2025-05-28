import mongoose, { Schema } from "mongoose";

export interface ICategory {
  _id: mongoose.Schema.Types.ObjectId, 
  name: string;
  description: string;
  slug: string;
  imges: string[]; 
  status: "ACTIVE" | "INACTIVE" | "REMOVED"; 
}

// Create the Category schema
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true, 
      trim: true, 
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
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


const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
