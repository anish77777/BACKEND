import jwt from 'jsonwebtoken';
import 'dotenv/config';

function authenticatedArtist(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify that the cookie was signed by this backend.
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // A valid normal user is authenticated but cannot manage artist content.
        if (decodedToken.role !== 'artist') {
            return res.status(403).json({
                message: 'Access denied. Artist role required.',
            });
        }

        // Pass the authenticated artist ID and role to the next controller.
        req.user = decodedToken;

        // Continue to the next route middleware or final controller.
        return next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
}

// to protect getMusic from unauthenticated users
function authenticatedUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // in this case we are not checking for role
        // because we want to show music to all users
        // let it be artist or user
        if(decodedToken.role !== 'artist' && decodedToken.role !== 'user') {
            return res.status(403).json({
                message: 'Access denied. Artist or user role required.',
            });
        }
        req.user = decodedToken;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}
export { authenticatedArtist, authenticatedUser };
