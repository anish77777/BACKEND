import express from "express";
import authController from "../controllers/auth.controller.js";
// or {registerUser} from "../controllers/auth.controller.js";

// Creates a mini Express application for authentication routes.
const router = express.Router();

// Handles POST requests to /register.
// If this router is mounted at "/auth", the complete URL is:
// POST /auth/register
router.post("/register", authController.registerUser);

// Export it so app.js can use it.
export default router;