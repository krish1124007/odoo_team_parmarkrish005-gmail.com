import multer from "multer"
import path from "path"

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/"); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = file.originalname.split(ext)[0];
        cb(null, `${name}-${Date.now()}${ext}`);
    },
});

// File filter (optional - to restrict file types)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, and JPEG files are allowed"), false);
    }
};

// Upload instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

export {upload}
