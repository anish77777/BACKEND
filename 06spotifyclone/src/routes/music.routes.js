import express from "express";
import multer from "multer";
import { createMusic, createAlbum, getAllMusic, getMusicByAlbumId } from "../controllers/music.controller.js";
import { authenticatedArtist, authenticatedUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Keep uploaded audio in memory so req.file.buffer can be sent to ImageKit.
const upload = multer({
  storage: multer.memoryStorage(),
});

// Middleware runs left to right:
// 1. authenticatedArtist verifies the cookie and sets req.user.
// 2. upload.single parses the multipart music file.
// 3. createMusic uploads and stores the song.
router.post(
  "/create",
  authenticatedArtist,
  upload.single("music"),
  createMusic,
);

// Album creation uses JSON, so it needs authentication but not Multer.
router.post("/createAlbum", authenticatedArtist, createAlbum);

router.get("/getMusic", authenticatedUser, getAllMusic);
// if we delete cookie and fet error its mean that our token verification is working

// if we delete cookie and fet error its mean that our token verification is working
router.get("/album/:id", authenticatedUser, getMusicByAlbumId);

export default router;
