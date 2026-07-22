import { app } from "./src/app.js";
import express from "express"

const notes = []
app.use(express.json())
//     {
//         title: "Note 1",
//         description: "This is note 1"
//     },
//     {
//         title: "Note 2",
//         description: "This is note 2"
//     },
//     {
//         title: "Note 3",
//         description: "This is note 3"
//     }
//  title and desc will be given by the user
// so we will post method to get notes here

app.post("/notes", (req, res) => {
    console.log(req.body);
    // to check if user gives both title and description
    // we use postman to send data to server 
    const { title, description } = req.body
    notes.push({ title, description })
    res.status(201).json({ message: "Note added successfully" })
})

app.get("/notes", (req, res) => {
    // send response with the notes list
    res.status(200).json({
        data: notes,
        msg: "this is the notes list"

    })
})

// delete note 
// ex: notes/3
// :index is the dynamic value it can be anything
app.delete("/notes/:index", (req, res) => {
    const index = req.params.index  // it gives the index in string format
    // converting the index to number
    notes.splice(Number(index), 1)
    res.status(200).json({ message: "Note deleted successfully" })
})
// patch is to update partial data of the resource 
app.patch("/notes/:index", (req, res) => {
    const index = req.params.index
    const { title, description } = req.body
    notes[Number(index)].title = title
    notes[Number(index)].description = description
    res.status(200).json({ message: "Note updated successfully" })
})


// start server on specific port
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

