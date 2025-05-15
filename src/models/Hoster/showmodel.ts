import mongoose, { Schema, Document } from "mongoose";

 interface IEventPoster extends Document {
  hosterId: mongoose.Schema.Types.ObjectId;
  poster: string;
  start: Date;
  end: Date;
  time: string;
  duration: string;
  age: string;
  capacity: number;
  language: string;
  genres: string[];
  location: string[];
  status: "pending" | "approve" | "cancelled" | "rejected";
  detail: string;
  price: number;
}

const EventPosterSchema = new Schema(
  {
    hosterId: {
      type: mongoose.Types.ObjectId,
      ref: "hosterdetails",
      required: true,
    },
    poster: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    age: { type: String, required: true },
    capacity: { type: Number, required: true },
    language: { type: String, required: true },
    genres: { type: [String], required: true },
    location: { type: [String], required: true },
    status: {
      type: String,
      enum: ["pending", "approve", "cancelled", "rejected"],
      default: "pending",
      required: true,
    },
    detail: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEventPoster>("Show", EventPosterSchema);
