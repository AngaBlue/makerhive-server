import sharp from "sharp"

export default async function processImage(image: Buffer, location: string, filename: string) {
    //Convert Images to Aspect Ration
    let thumbnail = sharp(image)
        .resize({
            height: 256,
            width: 384,
            withoutEnlargement: true
        })
        .toFile(`${location}/${filename}-thumb.jpg`)
    let full = sharp(image)
        .resize({
            height: 720,
            width: 1080,
            withoutEnlargement: true
        })
        .toFile(`${location}/${filename}.jpg`)
    return { thumbnail, full }
}