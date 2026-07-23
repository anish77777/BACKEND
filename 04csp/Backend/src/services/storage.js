import Imagekit, { toFile } from "@imagekit/nodejs"

const imageKit = new Imagekit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGEKIT_URL_ENDPOINT
})

// developer option on imagekit u can see private key there

async function uploadImage(buffer){
    const response = await imageKit.files.upload({
        file: await toFile(buffer, 'image.jpg'),
        fileName: 'image.jpg'
    })
    return response
}

export default uploadImage