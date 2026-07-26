import express from "express"
import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js"

const router = express.Router()

router.post("/createpost", async (req, res) => {
    const token = req.cookies.token
    // req.cookies.token is a string (the JWT)
    // dont use {token} = req.cookies.token — that tries to destructure a property from a string

    if (!token) {
        return res.status(401).json({ message: "You are not authorized" });
    }

    // what if user has wrong token? still can post so we check token with jwt.verify()
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        // decoded contains the payload: { id: user._id, iat: ..., exp: ... }
        // those data with which we created token  are here 
        // we received same data in decoded means token is correct
        // so we can post here
        
        // now the data we used to create token is in 
        const {id} = decoded
        const user = await userModel.findById(id)
        console.log(user)
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "token is not verified" });
    }

    console.log(token)
    console.log(req.body)
    res.json({ message: "Post created successfully" })
})

router.get("/getallposts", (req, res) => {
    res.json({ message: "All posts fetched successfully" })
})
// suppose i change my token manually user should not be allowed to post so we have to check if token is correct or not

export default router
