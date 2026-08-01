// ImageKit is created during module loading, so environment variables must load first.
import 'dotenv/config';
import ImageKit from '@imagekit/nodejs';

const imagekitClient = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(fileBuffer) {
    try {
        return await imagekitClient.files.upload({
            // ImageKit accepts the in-memory Multer buffer as Base64 data.
            file: fileBuffer.toString('base64'),
            // A timestamp prevents uploaded filenames from colliding.
            fileName: `music_${Date.now()}`,
            folder: 'spotifyclone',
        });
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw error;
    }
}

export { uploadFile };
