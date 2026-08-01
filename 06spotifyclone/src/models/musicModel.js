import mongoose from 'mongoose';

const musicSchema = new mongoose.Schema({
    uri: {
        // ImageKit URL is stored in MongoDB; the audio bytes stay in ImageKit.
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    artist: {
        // Store the creator ID for ownership checks.
        // ref lets Mongoose populate the ID with the matching user document.
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
});

// The model name must match ref: 'music' in related schemas.
const musicModel = mongoose.model('music', musicSchema);

export default musicModel;
