import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: "uploads/profile=images",
    filename: (req, file, cb) => {
        const uniqueName = `${req.user.id}=${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

export const uploadProfileImage = multer({storage: storage});