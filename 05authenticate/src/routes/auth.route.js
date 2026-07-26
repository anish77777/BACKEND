import express from "express";
import authController from "../controllers/auth.controller.js";
// or {registerUser} from "../controllers/auth.controller.js";

// Creates a mini Express application for authentication routes.
const router = express.Router();

// Handles POST requests to /register.
// If this router is mounted at "/auth", the complete URL is:
// POST /auth/register
router.post("/register", authController.registerUser);
// 1 user should not have 2 username
// 1 user should not have 2 email
// unique:true in schema will handle this

router.get('/test', (req, res) => {
    console.log(req.cookies)
    
    res.json({ message: 'Cookies are received',
    cookies: req.cookies
    });
});

// Export it so app.js can use it.
export default router;