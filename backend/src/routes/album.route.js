import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllAlbums, getAlbumById } from "../controllers/album.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;
