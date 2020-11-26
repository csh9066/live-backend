import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

const imageRouter = express.Router();

AWS.config.update({
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'live-image-storage',
    key(req, file, cb) {
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
  }),
  fileFilter(req, file, cb) {
    if (!file) {
      console.log('파일이 없습니다');
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

imageRouter.post('/', upload.single('img'), (req, res, next) => {
  const file = req.file as any;
  res.json({ url: file.location });
});

export default imageRouter;
