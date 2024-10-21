import { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions = {
  storage: diskStorage({
    destination: './public',
    filename: (req, file, cb) => {
      const uniqueSubffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSubffix}-${file.originalname}${ext}`;
      cb(null, filename);
    },
  }),
};

export default multerOptions;
