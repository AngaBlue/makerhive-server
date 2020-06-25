import multer from "multer";

//Allow image upload
export const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (["image/png", "image/jpeg"].includes(file.mimetype)) return callback(null, true);
        else return callback(new Error("Only .jpg and .png images are allowed."));
    },
    limits: {
        fileSize: 1024 * 1024
    }
});
