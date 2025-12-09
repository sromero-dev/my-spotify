import { Album } from "../models/album.model.js";

export const getAlbumById = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json("Albums found: " + albums);
  } catch (error) {
    next(error);
  }
};

export const getAllAlbums = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId).populate("songs"); // Populate means that we want to include the songs array in the response because it is a reference to another collection

    res.status(200).json("Album found: " + album);
  } catch (error) {
    next(error);
  }
};
