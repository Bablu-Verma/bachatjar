import mongoose, { Schema } from "mongoose";

export interface IUser  {
  name: string;
  email: string;
  profile?: string;
  password: string;
  phone?: string;
  subscribe_email?: string;
  accept_terms_conditions_privacy_policy: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  verify_code_expiry: Date;
  verify_code: string;
  role: string;
  dob?: Date;
  gender?: string;
  user_status:string;
  address?: {
    house_no?: string;
    landmark?: string;
    street?: string;
    area?: string;
    city_village?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Your name is required"],
    },
    profile: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please add a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone: {
      type: String,
    },
    subscribe_email: {
      type: String,
    },
    accept_terms_conditions_privacy_policy: {
      type: Boolean,
      required: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    phone_verified: {
      type: Boolean,
      default: false,
    },
    verify_code: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "data_editor", "blog_editor"],
      default: "user",
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    user_status: {
      type: String,
      default: 'ACTIVE',
      enum: ['ACTIVE', 'REMOVED']
    },
    address: {
      house_no: {
        type: String,
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
      area: {
        type: String,
        minlength: 1,
        maxlength: 100,
        trim: true,
      },
      city_village: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        match: /^[0-9]{5,6}$/,
      },
      country: {
        type: String,
        default: "India",
        trim: true,
      }
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
