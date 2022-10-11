const fs = require('fs');
const express = require('express');
const router = express.Router();
// MULTER UPLOAD
const multer = require('multer');

const UPLOAD_DIRECTORY = './public/uploads';

var upload = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      if (!fs.existsSync(UPLOAD_DIRECTORY)) {
        fs.mkdirSync(UPLOAD_DIRECTORY);
      } else {
        callback(null, UPLOAD_DIRECTORY);
      }
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  }),
}).single('file');

router.post('/products/:id', function (req, res, next) {
  upload(req, res, function (err) {
    console.log(req.params);
    if (err instanceof multer.MulterError) {
      res.status(500).json({ type: 'MulterError', err: err });
    } else if (err) {
      res.status(500).json({ type: 'UnknownError', err: err });
    } else {
      res.status(200).json({ ok: true, publicUrl: `${req.protocol}://${req.hostname}:9000/uploads/${req.file.filename}`, file: req.file });
    }
  });
});

module.exports = router;
