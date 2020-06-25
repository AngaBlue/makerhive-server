import sharp from "sharp";

export default async function processImage(image: Buffer, location: string, filename: string) {
    //Convert Images to Aspect Ratio of 4:3
    let thumbnail = sharp(image)
        .resize({
            height: 225,
            width: 300,
            withoutEnlargement: true
        })
        .toFile(`${location}/${filename}-thumb.jpg`);
    let full = sharp(image)
        .resize({
            height: 600,
            width: 800,
            withoutEnlargement: true
        })
        .toFile(`${location}/${filename}.jpg`);
    return { thumbnail, full };
}
