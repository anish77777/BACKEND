import app from './src/app.js';
import connectDB from './src/db/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`05authenticate API running at http://localhost:${PORT}`);
            console.log(`Register route: POST http://localhost:${PORT}/api/auth/register`);
        });
    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
};

startServer();
