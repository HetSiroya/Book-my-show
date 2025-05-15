import mongoose, { Schema, Document, model } from "mongoose";

// TypeScript interface with lowercase property names
export interface IUserBankDetails extends Document {
  name: string;
  pancard: string;
  address: string;
  return: string;
  state: string;
  fullName: string;
  email: string;
  passWord: string;
  mobileNumber: number;
  accountOwner: string;
  accountType: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  isVerified: boolean;
}

// Mongoose schema with lowercase field names
const UserBankDetailsSchema: Schema = new Schema<IUserBankDetails>({
  name: { type: String, required: true },
  pancard: { type: String, required: true },
  address: { type: String, required: true },
  return: { type: String, required: false },
  state: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  passWord: { type: String, default: "" },
  mobileNumber: { type: Number, required: true },
  accountOwner: { type: String, required: true },
  accountType: { type: String, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifsc: { type: String, required: true, match: /^[A-Z]{4}0[A-Z0-9]{6}$/ },
  isVerified: { type: Boolean, required: true, default: false },
});

// Model
const hosterDetailsModel = model<IUserBankDetails>(
  "HosterDetails",
  UserBankDetailsSchema
);

export default hosterDetailsModel;
