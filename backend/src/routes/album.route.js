import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware";

const router = Router();

router.use(protectRoute);

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumById);

export default router;
