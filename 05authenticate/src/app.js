import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/post.routes.js";

dotenv.config();

// we dont use every api in this project
// we just use routes and models

const app = express();
app.use(express.json())
app.use(cookieParser()) // parses cookies from req headers into req.cookies

// Use this endpoint to confirm that the correct backend is running.
app.get('/api/health', (req, res) => {
    res.json({ message: '05authenticate API is running' });
});

// POST api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
// for use of router we have to use app.use(prefix, router)
// prefix is the path that will be added to the route prefix=mount point
// router is the router object that will be used
// so POST /api/auth/register will be called as /api/auth/register
// mount + router path = final path

export default app
