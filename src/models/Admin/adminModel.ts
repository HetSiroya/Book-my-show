import mongoose from "mongoose";
import { model } from "mongoose";

interface Admin {
  name: string;
  email: string;
  password: string;
  mobileNumber: number;
  isDeleted: boolean;
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
  },
  {
    timestamps: true,
  }
);
const userModel = model<Admin>("Admin", User);
export default userModel;
