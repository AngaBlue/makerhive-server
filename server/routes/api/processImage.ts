import sharp from "sharp";

export default async function processImage(image: Buffer, location: string, filename: string) {
    //Convert Images to Aspect Ratio of 4:3
    //Thumbnail: 225x300
    let thumbnail = sharp(image)
        .resize({
            height: 225,
            width: 300,
            withoutEnlargement: true
        })
        .toFile(`${location}/${filename}-thumb.jpg`);
    //Full Size: 600x800
    let full = sharp(image)
        .resize({
            height: 600,
            width: 800,
            withoutEnlargement: true
        })
        .toFile(`${location}/${filename}.jpg`);
    return { thumbnail, full };
}
