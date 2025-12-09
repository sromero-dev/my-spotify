import { Song } from "../models/song.model";

export const getAllSongs = async (req, res, next) => {
  try {
    // -1 means that we want to sort by createdAt in descending order
    // 1 means that we want to sort by createdAt in ascending order
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json("Songs found: " + songs);
  } catch (error) {
    next(error);
  }
};
