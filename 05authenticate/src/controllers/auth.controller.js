import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const isUserExist = await userModel.findOne({username, email})
        if(isUserExist){
            return res.status(409).json({message: "User already exist"})
        }
        // why return
        // return is used to stop the function from executing further
        // and we dont want to execute the code below if user already exist 
        
        console.log(username, email, password)
        const user = await userModel.create({username, email, password})
     // this is what we pass during login 
     // JSON WEB TOKEN
     // 1. we have to give UNIQUE identifier of the user (eg. id, username)
     // 2. we have to give secret key
     // secret key is the key that we use to sign the token 
     // 3. we have to give expiration time
     // expiration time is the time after which the token will expire 

    
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        
        // user._id is the unique identifier of the user given by mongoose model
        // that means this token belongs to this user
        // this is the data that will be stored in the token 
        // jwt sign require mainly two value
        // JWT secret  can be obtained from jwt secret generator in google
      
        // now with every req from clent we received cookie (this cookies are stored in browser)
        res.cookie("token", token)
        // res.cookie(name, value, {options})
        // options are httpOnly, secure, sameSite, maxAge
        res.json({message: "User registered successfully", token, user})
    } catch (error) {
        console.log(error)
        // if you try to push same username or email , it will show error
        // error code is 11000 if you try to push duplicate key
        // code is 11000 and message starts with "E11000 duplicate key error" means 
        res.json({message: "Error while registering user"})
    }
}
export default {registerUser}

