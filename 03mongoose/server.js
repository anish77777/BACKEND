import app from "./src/app.js"
import connectDB from "./src/db/db.js"
import express from "express"
// NOW WE HAVE TO CONNECT SERVER TO MONGODB DATABASE 
// done this in async function just check if it connnected using try catch block
// if connected then print message otherwise print error
// look at db.js file 
import { Note } from "./src/model/note.model.js"
// note model
// we have imported note from notes module here 
// because we have to use this note to perform CRUD 
connectDB()

// Schema: Defines the structure, fields, and validation rules of the data (the blueprint).
// Model: A wrapper around the schema that interacts with the database (provides CRUD methods).

// 4 apis
app.use(express.json()) // this is used to parse the incoming requests to the server
app.post("/notes", async (req, res) => {
    const { title, description } = req.body
    await Note.create({ title, description })
    res.status(201).json({ message: "Note added successfully" })
})
// is this gonna push data in mongo db? 
// yes it will push data in mongo db 
// mongoose automatically creates collection name of model and plural of that
// so model note is converted into notes collection 
// also it convert this note model into plural s i.e notes

app.get("/notes", async (req, res) => {
    const notes = await Note.find()
    res.status(200).json(notes)
})
// find() is used to find all the documents in the collection
// it returns a array of documents
// findOne({title: 'value'}): find one document 
// it returns only one document if there are multiple documents with same title then it returns only first document
// find give array of objects [{}, {}, {}]
// findOne give object {}

app.delete("/notes/:id", async (req, res) => {
    const { id } = req.params
    await Note.findByIdAndDelete(id)
    res.status(200).json({ message: "Note deleted successfully" })
})
// findOneAndDelete({_id : "value"})
// findOneAndUpdate({_id: "value"}, {})
app.patch("/notes/:id", async (req, res) => {
    const { id } = req.params
    const { title, description } = req.body
    await Note.findByIdAndUpdate(id, { title, description })
    res.status(200).json({ message: "Note updated successfully" })
})


app.listen(3000,()=>{
    console.log("server is running on port 3000")
})