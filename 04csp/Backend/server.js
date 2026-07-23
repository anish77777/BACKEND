import app from "./src/app.js"
import connectDB from "./src/db/db.js"
import {Post} from "./src/model/post.model.js"
import express from "express"
import multer from "multer"
import uploadImage from './src/services/storage.js'
import cors from 'cors' 
app.use(cors()) 

// app is the instance of express application
// we have to listen the app on some port 
// we will post img url and caption
// and fetch this in feed page

app.use(express.json())  // this will parse the incoming request to the server

// app.use(express.json()) is used to only parse the json data from the incoming request 
// if we don't use this then req.body will be undefined
// because the incoming request will be in the form of json
// app.use(express.json()) expects string 

// multer.memoryStorage() tells multer to store uploaded files temporarily in RAM as a Buffer (req.file.buffer)
// instead of saving them to disk storage. This is ideal when directly forwarding files to external cloud storage like ImageKit.
const upload = multer({storage: multer.memoryStorage()})  
connectDB();

// upload.single('image') is route middleware:
// 1. It parses incoming 'multipart/form-data' requests.
// 2. It looks for a single file attached under the form key named 'image'.
// 3. It attaches the file object to 'req.file' and text fields (e.g. caption) to 'req.body'.
app.post('/createpost', upload.single('image'), async (req, res)=>{
    const {caption} = req.body 
    console.log(req.body)
    console.log(req.file)
    if (!req.file) {
        return res.status(400).json({ message: "Please select an image file under the 'image' field" })
    }
    const result=await uploadImage(req.file.buffer)
    const post = await Post.create({image:result.url, caption})
    res.status(201).json({message: "Post created successfully", post})
})
app.get("/post", async(req, res)=>{
    const posts = await Post.find()
    res.status(200).json(posts)
})

// here image and caption is form data so we use multer

app.listen(3000, () => {
    console.log("server is running on port 3000")
})
