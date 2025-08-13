import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * Middleware to handle file public using multer.
 * Files are stored in the 'public' directory with a timestamp prefix.
 */


const localStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

export const getUploadMiddleware = () => {
    const storage =  localStorage;
    return multer({ storage });
};