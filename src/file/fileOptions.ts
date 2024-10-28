import { memoryStorage } from 'multer';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export const multerOptions = {
  storage: memoryStorage(), // Store files in memory temporarily
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
};
