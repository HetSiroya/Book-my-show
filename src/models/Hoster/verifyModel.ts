import mongoose from "mongoose";
import { model } from "mongoose";

interface Iverify {
  mobileNumber: Number;
  otp: Number;
  isVerified: boolean;
}

const verify = new mongoose.Schema<Iverify>({
  mobileNumber: {
    type: Number,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const verifyModel = model<Iverify>("verify", verify);
export default verifyModel;
