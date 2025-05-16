import mongoose, { Schema, Document } from "mongoose";

interface IEventPoster extends Document {
  hosterId: mongoose.Schema.Types.ObjectId;
  name: string;
  poster: string;
  start: string;
  end: string;
  time: string;
  duration: string;
  age: number;
  capacity: number;
  language: string;
  genres: string[];
  location: string[];
  status: "pending" | "approved" | "cancelled" | "rejected";
  detail: string;
  price: number;
}

const EventPosterSchema = new Schema<IEventPoster>(
  {
    hosterId: {
      type: mongoose.Types.ObjectId,
      ref: "hosterdetails",
      required: true,
    },
    name: { type: String, required: true },
    poster: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, required: true },
    age: { type: Number, required: true },
    capacity: { type: Number, required: true },
    language: { type: String, required: true },
    genres: { type: [String], required: true },
    location: { type: [String], required: true },
    detail: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled", "rejected"],
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const showModel = mongoose.model<IEventPoster>("Show", EventPosterSchema);
export default showModel;
