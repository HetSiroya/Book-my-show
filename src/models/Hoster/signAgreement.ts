import { Schema } from "inspector/promises";
import mongoose from "mongoose";
import { model } from "mongoose";

interface Idocument {
  hosterId: mongoose.Schema.Types.ObjectId;
  agreement: string;
  isVerified: boolean;
}

const agreementSchema = new mongoose.Schema<Idocument>({
  hosterId: {
    type: mongoose.Types.ObjectId,
    ref: "hosterdetails",
    required: true,
  },
  agreement: {
    type: String,
    required: true,
  },
  isVerified: { type: Boolean, required: true, default: false },
});
const agreementModel = model<Idocument>("agreement", agreementSchema);
export default agreementModel;
