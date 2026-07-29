import app from "./src/app.js";
import connectDB from "./src/db/db.js";

await connectDB();


        
app.listen(3000, () => {
    console.log(`SpotifyClone API running on http://localhost:3000`);
});