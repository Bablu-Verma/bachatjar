import  { Schema, model, models } from "mongoose";


export interface IContactUs {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone_number?: string;
  location?: string;
  createdAt:string;
  action_status: "NOTSTART" | "OPEN" | "CLOSED" | "REMOVED";
}

const ContactUsSchema = new Schema<IContactUs>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address."],
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
    },
    location: {
      type: String,
      required: false,
    },
    action_status: {
      type: String,
      default: "NOTSTART",
      enum: ["NOTSTART", "OPEN", "CLOSED", "REMOVED"],
    },
  },
  { timestamps: true } 
);


const ContactUsModel = models.ContactUs || model<IContactUs>("ContactUs", ContactUsSchema);

export default ContactUsModel;
