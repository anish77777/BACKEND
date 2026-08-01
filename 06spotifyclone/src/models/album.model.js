import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    artist: {
        // The logged-in artist ID identifies who owns the album.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    musics: [
        {
            // The client sends selected music IDs; ref enables populate('musics').
            type: mongoose.Schema.Types.ObjectId,
            ref: 'music',
            required: true,
        },
    ],
});

const albumModel = mongoose.model('album', albumSchema);

export default albumModel;
