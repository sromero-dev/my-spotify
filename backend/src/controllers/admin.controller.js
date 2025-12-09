import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Audio and image files are required" });
    }

    const { title, artist, albumId, duration, year } = req.body;

    const song = await Song.create({
      title,
      artist,
      albumId: albumId || null,
      imageUrl: req.files.imageFile.path,
      audioUrl: req.files.audioFile.path,
      duration,
      year,
    });

    await song.save();

    // If song belongs to an album, update album's songs array
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json({ message: "Song created successfully: ", song });
  } catch (error) {
    res.status(500).json({ message: "Internal server error: " + error });
    next(error);
  }
};
