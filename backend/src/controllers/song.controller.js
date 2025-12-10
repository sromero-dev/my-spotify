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

export const getFeaturedSongs = async (req, res, next) => {
  try {
    // Fetch some songs using mongodb's aggregation pipeline
    // 6 means that we want to get 6 random songs, $sample is a mongodb operator that fetches random documents
    // $project passes along the documents with the requested fields to the next stage in the pipeline.
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json("Featured songs found: " + songs);
  } catch (error) {
    next(error);
  }
};

export const getMadeForYouSongs = async (req, res, next) => {
  try {
    //TODO Implement an algorithm that recommends songs to the user
    const songs = await Song.aggregate([
      {
        $sample: { size: 6 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        },
      },
    ]);
    res.status(200).json("Featured songs found: " + songs);
  } catch (error) {
    next(error);
  }
};

export const getTrendingSongs = async (req, res, next) => {};
