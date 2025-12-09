import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { getAllSongs } from "../controllers/song.controller";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get("/songs", getAllSongs);

export default router;
