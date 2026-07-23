import mongoose from "mongoose"
import "dotenv/config"
// this db file will contain all the code related to connecting the database 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        // this is connnecting our database to our node js server
        // if db is not present it will create a new db for you automatically
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("Database connection error: ", error);
        process.exit(1); // Exit the process if we cannot connect to the database
    }
}


export default connectDB