import express from 'express';
import * as fileServices from '../services/file.services';
const multer = require("multer");
const router = express.Router();

const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

require('dotenv').config()

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG are currently supported."), false)
  }
}

var s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.SECRET_KEY,
    accessKeyId: process.env.ACCESS_KEY,
  },
  region: 'us-east-1',
});

const uploadFiles = (req, res, next) => {
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "everything-1",
      key: function (req, file, cb) {
        const { userId } = req.body;
        cb(null, `images/users/${userId}/${new Date().toISOString() + '-' + file.originalname}`);
      }
    }),
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
  }).array("files", 8);

  // Error handling
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError)
      return res.status(400).json({
        message: 'Upload unsuccessful',
        errorMessage: error.message,
        errorCode: error.code
      })

    if (error)
      return res.status(500).json({
        message: 'Error occured',
        errorMessage: error.message
      })
    next()
  })
}

router.post('/', uploadFiles, function (req, res, next) {
  const { thingId } = req.body;
  // create the media and tag objects, can this be done in one SQL command?
  try {
    // @ts-ignore
    for (let i = 0; i < req.files.length; i++) {
      // @ts-ignore
      fileServices.uploadFile(req.files[0].location, thingId);
    }
    res.send({
      message: "Uploaded!",
      // @ts-ignore
      urls: req.files.map(function (file) {
        return { url: file.location, name: file.key, type: file.mimetype, size: file.size };
      })
    })
  } catch (error) {
    res.status(400).send({
      message: `Uploaded to S3, but exception while creating Media: ${error.message}`,
      // @ts-ignore
      urls: req.files.map(function (file) {
        return { url: file.location, name: file.key, type: file.mimetype, size: file.size };
      })
    })
  }
});

export default router;