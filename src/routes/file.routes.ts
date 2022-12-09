import express from 'express';
const multer = require("multer");
const router = express.Router();

const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

require('dotenv').config()

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      cb(null, false)
  }
}

var s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  },
  region: 'us-east-1',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "everything-1",
    key: function (req, file, cb) {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
}
});

router.post('/', upload.array("files", 8), function (req, res, next) {
  const { thingId } = req.body;
  console.log(thingId);
  console.log(req.files);
  // create the media and tag objects, can this be done in one SQL command?
  res.send({
    message: "Uploaded!"
    })
});

export default router;