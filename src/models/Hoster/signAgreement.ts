import { Schema } from "inspector/promises";
import mongoose from "mongoose";
import { model } from "mongoose";

interface Idocument {
  hosterId: mongoose.Schema.Types.ObjectId;
  agreement: string;
}

const agreementSchema = new mongoose.Schema<Idocument>({
  hosterId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  agreement: {
    type: String,
    required: true,
  },
});
const agreementModel = model<Idocument>("agreement", agreementSchema);
export default agreementModel;
