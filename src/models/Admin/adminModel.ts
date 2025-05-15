import mongoose from "mongoose";
import { model } from "mongoose";

interface Admin {
  name: string;
  email: string;
  password: string;
  mobileNumber: number;
  isDeleted: boolean;
  isApproved: boolean;
}

const User = new mongoose.Schema<Admin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const adminModel = model<Admin>("Admin", User);
export default adminModel;
