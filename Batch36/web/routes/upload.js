var express = require('express');
var router = express.Router();

const { Product } = require('../models');

const fs = require('fs');
const path = require('path');

// MULTER UPLOAD
const multer = require('multer');

const UPLOAD_DIRECTORY = './public/uploads';

// Middleware upload
var upload = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      const PATH = `${UPLOAD_DIRECTORY}/products/${req.params.id}`;
      // console.log('PATH', PATH);
      if (!fs.existsSync(PATH)) {
        // Create a directory
        fs.mkdirSync(PATH, { recursive: true });
      }
      callback(null, PATH);
    },
    filename: function (req, file, callback) {
      const safeFileName = toSafeFileName(file.originalname);
      callback(null, safeFileName);
    },
  }),
}).single('file');

function toSafeFileName(fileName) {
  const fileInfo = path.parse(fileName);
  const safeFileName = fileInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + fileInfo.ext;
  return safeFileName;
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'Welcome to the UPLOAD API',
  });
});

router.post('/products/:id', async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      // An error occurred when uploading
      return res.status(500).json({ message: err.message });
    }
    // Everything went fine
    // console.log('host', req.get('host'));

    const id = req.params.id;
    const patchData = {
      imageUrl: `/uploads/products/${req.params.id}/${req.file.filename}`,
    };

    let found = await Product.findByIdAndUpdate(id, patchData);

    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.params.id}/${req.file.filename}`;

    res.status(200).json({ message: 'File uploaded successfully', publicUrl });
  });
});

module.exports = router;
