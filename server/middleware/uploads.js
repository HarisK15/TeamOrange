const multer = require('multer');
const fs = require('fs');

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = './uploads/';
    fs.exists(dir, exist => {
      if (!exist) {
        return fs.mkdir(dir, error => cb(error, dir))
      }
      return cb(null, dir);
    });
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = {
  upload
};