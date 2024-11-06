import { diskStorage } from 'multer';
import { extname } from 'path'; // For file extension handling
import { v4 as uuidv4 } from 'uuid';
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
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Specify the destination directory where files will be stored
      cb(null, './storage');
    },
    filename: (req, file, cb) => {
      // Generate a unique filename to avoid name clashes
      const fileExtension = extname(file.originalname);
      const uniqueName = `${uuidv4()}${fileExtension}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Accept only certain file types (optional)
    if (file.mimetype.match(/^image\/(png|jpeg|jpg)|video\/(mp4|webm|ogg)$/)) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Invalid file type'), false); // Reject the file
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB (optional)
  },
};
