import mongoose from "mongoose"


const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }
})

export const Note = mongoose.model("Note", noteSchema)

// HERE WHY MODEL IS WRAPPER OF SCHEMA? 
// Because schema provides the structure of the data
// and model interacts with the database to store and retrieve the data 
// so model is the wrapper of schema for our use 

// is schema mandatory?
// if schema is not defined then mongoose will create a default schema for you
// but if you want to add validation or specific structure then you need to define schema 