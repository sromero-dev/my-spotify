import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";

config();

const songs = [
  {
    title: "Stay With Me",
    artist: "The Weeknd",
    imageUrl: "/cover-images/1.jpg",
    audioUrl: "/songs/1.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "The Hills",
    artist: "The Weeknd",
    imageUrl: "/cover-images/2.jpg",
    audioUrl: "/songs/2.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "The Stars",
    artist: "The Weeknd",
    imageUrl: "/cover-images/3.jpg",
    audioUrl: "/songs/3.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    imageUrl: "/cover-images/4.jpg",
    audioUrl: "/songs/4.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "Save Your Tears",
    artist: "The Weeknd",
    imageUrl: "/cover-images/5.jpg",
    audioUrl: "/songs/5.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "After Hours",
    artist: "The Weeknd",
    imageUrl: "/cover-images/6.jpg",
    audioUrl: "/songs/6.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "Starboy",
    artist: "The Weeknd",
    imageUrl: "/cover-images/7.jpg",
    audioUrl: "/songs/7.mp3",
    duration: 600,
    year: 2001,
  },
  {
    title: "Dawn FM",
    artist: "The Weeknd",
    imageUrl: "/cover-images/8.jpg",
    audioUrl: "/songs/8.mp3",
    duration: 600,
    year: 2001,
  },
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Song.deleteMany({});

    await Song.insertMany(songs);

    console.log("Songs seeded successfully");
  } catch (error) {
    console.error("Error seeding songs: " + error);
  } finally {
    mongoose.connection.close();
  }
};

seedSongs();
