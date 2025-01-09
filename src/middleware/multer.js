import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().getTime();
    const originalname = file.originalname;
    // const extension = path.extname(file.originalname);

    cb(null, `${timestamp}-${originalname}`);
  }
});


// const cekNull = (fileUpload) => (fileUpload?.[0]?.filename ?? null);

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1000 * 1000 // 3 MB
  }
});

export default upload;