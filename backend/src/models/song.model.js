import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: { type: Number, required: true, min: 0 },
    year: {
      type: Number,
      required: true,
      min: 1500,
      max: new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
