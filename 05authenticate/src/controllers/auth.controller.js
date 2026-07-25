import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body
        console.log(username, email, password)
        const user=await userModel.create({username,email,password})
    // this is what we pass during login 
    // JSON WEB TOKEN
    // 1. we have to give UNIQUE identifier of the user (eg. id, username)
    // 2. we have to give secret key
    // secret key is the key that we use to sign the token 
    // 3. we have to give expiration time
    // expiration time is the time after which the token will expire 
    
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
        // jwt sign require mainly two value
        // JWT secret  can be obtained from jwt secret generator in google


        res.json({message: "User registered successfully", token, user})
    } catch (error) {
        console.log(error)
        res.json({message: "Error while registering user"})
    }
}
export default {registerUser}

