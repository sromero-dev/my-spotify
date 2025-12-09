// Imports
import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";

// Database
import { connectDB } from "./lib/db.js";

// Routes
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import songsRoutes from "./routes/song.route.js";
import albumsRoutes from "./routes/album.route.js";
import statsRoutes from "./routes/stat.route.js";

// Environment variables
dotenv.config();

// Express server
const app = express();
const __dirname = path.resolve();
const PORT = process.env.PORT;

// Middleware
app.use(express.json()); // Allows JSON requests
app.use(clerkMiddleware()); // Allows Clerk authentication by adding the object 'auth' to requests
app.use(
  // Uses express-fileupload to upload files to the server and store them in the '/tmp' directory
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "/tmp/"),
    createParentPath: true,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50 MB
    },
  })
);

// Application routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songsRoutes);
app.use("/api/albums", albumsRoutes);
app.use("/api/stats", statsRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message:
      process.env.NODE_ENV === "development"
        ? "Internal server error: " + err
        : "Internal server error",
  });
});

// Server start
app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
