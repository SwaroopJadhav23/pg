import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/upload');
fs.mkdirSync(uploadDir, { recursive: true });

const imageFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith('image/')) {
    cb(null, true);
    return;
  }
  cb(new Error('Only image files are allowed'));
};

function createImageUpload(prefix, fieldName, maxCount = 1) {
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFilter
  });

  return maxCount === 1 ? upload.single(fieldName) : upload.array(fieldName, maxCount);
}

export const tenantPhotoUpload = createImageUpload('tenant', 'photo');
export const propertyPhotosUpload = createImageUpload('property', 'photos', 10);

export function handleUploadError(error, req, res, next) {
  if (!error) return next();
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('Photo must be smaller than 5 MB', 422));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new AppError('You can upload up to 10 photos at a time', 422));
    }
    return next(new AppError(error.message, 422));
  }
  return next(new AppError(error.message || 'Upload failed', 422));
}
