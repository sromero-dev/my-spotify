import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

// Helper fn for uploading files to cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const res = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return res.secure_url;
  } catch (error) {
    console.error("Error uploading file to cloudinary: " + error);
    throw new Error({ message: "Error uploading file to cloudinary" }); // Error handling
  }
};

export const checkAdmin = async (req, res, next) => {
  // Check if user is admin
  res.status(200).json({ admin: true });
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res
        .status(400)
        .json({ message: "Audio and image files are required" });
    }

    // Destructure song data
    const { title, artist, albumId, duration, year } = req.body;
    const { audioFile, imageFile } = req.files;

    // Upload files to cloudinary
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = await Song.create({
      title,
      artist,
      albumId: albumId || null,
      imageUrl,
      audioUrl,
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
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  // Delete song fn
  try {
    const { id } = req.params; // Gets song id

    const song = await Song.findById(id); // Finds song by Id
    if (song.albumId) {
      // If song belongs to an album, update album's songs array
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id); // Deletes song

    res.status(200).json({ message: "Song deleted successfully: ", song });
  } catch (error) {
    console.error("Error deleting song: " + error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, year } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      year,
    });

    await album.save();

    res.status(201).json({ message: "Album created successfully: ", album });
  } catch (error) {
    console.error("Error creating album: " + error);
    next(error);
  }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params; // Gets album id
    await Song.deleteMany({ albumId: id }); // Deletes all songs in album
    await Album.findByIdAndDelete(id); // Deletes album
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album: " + error);
    next(error);
  }
};
