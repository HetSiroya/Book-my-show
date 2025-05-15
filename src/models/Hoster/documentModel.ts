import { Schema } from "inspector/promises";
import mongoose from "mongoose";
import { model } from "mongoose";

interface Idocument {
  hosterId: mongoose.Schema.Types.ObjectId;
  pancard: String;
  cheques: String;
}

const documnetSchema = new mongoose.Schema<Idocument>({
  hosterId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  cheques: {
    type: String,
    // required: true,
  },
  pancard: {
    type: String,
    required: true,
  },
});
const documnetModel = model<Idocument>("document", documnetSchema);
export default documnetModel;
