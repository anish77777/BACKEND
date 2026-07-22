import mongoose from "mongoose"
// this db file will contain all the code related to connecting the database 

const connectDB = async () => {
    try {
        // MongoDB Atlas connection string (requires IP whitelisting in MongoDB Atlas dashboard)
        // const uri = "mongodb+srv://yt:2ZTiIJgWmyAvckTl@cluster0.jjx0nss.mongodb.net/notes"
        // aint this create Note db export const Note = mongoose.model("Note", noteSchema)
        // here i put notes in place of Note then what?
        // will this create two db notes and Note?
        // what is difference between mongoose.model and mongoose.model
        // let's see by running this code
        // 

        // Local MongoDB connection (recommended for offline development)
        // const uri = "mongodb://127.0.0.1:27017/notes"

        const uri = "mongodb+srv://yt:WMeAGAbvXwnTPnob@cluster0.myne4zf.mongodb.net/"

        await mongoose.connect(uri)
        // this is connnecting our database to our node js server
        // if db is not present it will create a new db for you automatically
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Database connection error: ", error);
        process.exit(1); // Exit the process if we cannot connect to the database
    }
}


export default connectDB