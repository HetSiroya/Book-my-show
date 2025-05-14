import mongoose from "mongoose";
import { model } from "mongoose";

interface Hoster {
  name: string;
  email: string;
  password: string;
  mobileNumber: number;
  isDeleted: boolean;
}

const hoster = new mongoose.Schema<Hoster>(
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
const hosterModel = model<Hoster>("Hoster", hoster);
export default hosterModel;
