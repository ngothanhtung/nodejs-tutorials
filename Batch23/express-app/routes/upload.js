const fs = require('fs');
const express = require('express');
const router = express.Router();
// MULTER UPLOAD
const multer = require('multer');
const { updateDocument } = require('../helpers/MongoDbHelper');

const UPLOAD_DIRECTORY = './public/uploads/categories';

var upload = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      const categoryId = req.params.id;
      const PATH = UPLOAD_DIRECTORY + '/' + categoryId;

      if (!fs.existsSync(PATH)) {
        // Create a directory
        fs.mkdirSync(PATH);
      }
      callback(null, PATH);
    },
    filename: function (req, file, callback) {
      // Xử lý tên file cho chuẩn
      // code here...

      // return
      callback(null, file.originalname);
    },
  }),
}).single('file');

// http://localhost:9000/upload/categories/63293fea50d2f78624e0c6f3
router.post('/categories/:id', function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).json({ type: 'MulterError', err: err });
    } else if (err) {
      res.status(500).json({ type: 'UnknownError', err: err });
    } else {
      const categoryId = req.params.id;
      console.log('categoryId:', categoryId);

      // MONGODB
      updateDocument(categoryId, { imageUrl: `/uploads/categories/${categoryId}/${req.file.filename}` }, 'categories');
      console.log(req.params);
      console.log(req.body);
      //
      const publicUrl = `${req.protocol}://${req.hostname}:9000/uploads/categories/${categoryId}/${req.file.filename}`;
      res.status(200).json({ ok: true, publicUrl: publicUrl, file: req.file });
    }
  });
});

module.exports = router;
