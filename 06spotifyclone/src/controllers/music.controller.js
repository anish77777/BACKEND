import musicModel from '../models/musicModel.js';
import albumModel from '../models/album.model.js';
import { uploadFile } from '../services/storage.service.js';

async function createMusic(req, res) {
    // req.user is a custom request property set by authenticatedArtist middleware.
    // It contains the verified JWT payload, such as { id, role, iat }.
    const decodedToken = req.user;

    // Multer puts multipart text fields in req.body and the music file in req.file.
    const { title } = req.body;
    const file = req.file;

    if (!title?.trim()) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!file) {
        return res.status(400).json({ message: 'Music file is required' });
    }

    try {
        // Upload only the binary buffer; ImageKit returns the URL saved in MongoDB.
        const result = await uploadFile(file.buffer);

        const music = await musicModel.create({
            title: title.trim(),
            uri: result.url,
            // Save the creator ID so album ownership can be checked later.
            artist: decodedToken.id,
        });

        return res.status(201).json({
            message: 'Music created successfully',
            music: {
                id: music._id,
                title: music.title,
                uri: music.uri,
                artist: music.artist,
            },
        });
    } catch (error) {
        console.error('Error creating music:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function createAlbum(req, res) {
    // req.user is the verified JWT payload added by authenticatedArtist middleware.
    // Reuse its id and role instead of verifying the token again.
    const decodedToken = req.user;

    // The frontend sends IDs for the existing songs selected for this album.
    const { title, musicIds } = req.body;

    if (!title?.trim()) {
        return res.status(400).json({ message: 'Title is required' });
    }

    if (!Array.isArray(musicIds) || musicIds.length === 0) {
        return res.status(400).json({
            message: 'musicIds must be a non-empty array',
        });
    }

    try {
        // Send an array of valid music ID strings.
        // Mongoose converts them into ObjectIds using the album schema.
        const album = await albumModel.create({
            title: title.trim(),
            musics: musicIds,
            // you can send array of strings as music ids in place of object ids
            // mongo db will convert them into object ids automatically
            // but if you send mixed array of strings and object ids
            // it will throw error that one or more ids are invalid
            artist: decodedToken.id,
            // decodedToken is the id of the artist who is creating the album
            // receive from {
            //     id: "6a6a284081bf02ca94cc8514",
            //     role: "artist",
            //     iat: 1785460000
            // }
            // console.log(decodedToken)
        });

        return res.status(201).json({
            message: 'Album created successfully',
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            },
        });
    } catch (error) {
        console.error('Error creating album:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getAllMusic(req, res) {
    try {
        const music = await musicModel.find().populate("artist");
        // populate is used to get the data from the other collection
        // in this case we are getting the artist data from the user model
        // because we have stored the artist id in the music model
        // and we are populating the artist field with the user model
        // we can also select specific fields from the other collection
        // const music = await musicModel.find().populate("artist", "username");
        return res.status(200).json({
            message: 'Music fetched successfully',
            music,
        });
    } catch (error) {
        console.error('Error fetching music:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function getMusicByAlbumId(req, res) {
    try {
        const album = await albumModel.findById(req.params.id).select("title artist").populate("artist", "username");
        return res.status(200).json({
            message: 'Album fetched successfully',
            album,
        });
    } catch (error) {
        console.error('Error fetching album:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export { createMusic, createAlbum, getAllMusic, getMusicByAlbumId };
