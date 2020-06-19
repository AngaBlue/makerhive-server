import multer from "multer";

export const storage = multer.memoryStorage()
export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (['image/png', 'image/jpeg'].includes(file.mimetype))
            return callback(null, true)
        else
            return callback(new Error('Only .jpg/.jpeg and .png images are allowed.'))
    },
    limits: {
        fileSize: 1024 * 1024
    }
})

/*router.post("/item", upload.single('item'), async (req, res, next) => {
    let thumbnail = sharp(req.file.buffer)
        .resize({
            height: 256,
            withoutEnlargement: true
        })
        .toFile(path.join(__dirname, "../static/img/item/pic.jpg"))
})*/
