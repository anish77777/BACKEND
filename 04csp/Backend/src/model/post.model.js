import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    image: String,  // store as string url of the image
    caption: String,
})

export const Post = mongoose.model("Post", postSchema)

// now we have to create user schema for this we have to import mongoose
// we have to create a class and we have to export it
// we have to give a name to model
// we have to give a schema to model


// there can be many collection in a single database so we give a collection name here 