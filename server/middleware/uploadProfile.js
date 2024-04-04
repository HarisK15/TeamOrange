const multer = require('multer');
const fs = require('fs');

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log('In destination function');
    const dir = './profilers/';
    fs.exists(dir, exist => {
      if (!exist) {
        console.log('Directory does not exist, creating directory');
        return fs.mkdir(dir, error => {
          if (error) {
            console.error('Error creating directory:', error);
          }
          cb(error, dir);
        });
      }
      console.log('Directory exists');
      return cb(null, dir);
    });
  },
  filename: function(req, file, cb) {
    console.log('In filename function');
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});
const coverPhotoStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log('In destination function');
    const dir = './covers/';
    fs.exists(dir, exist => {
      if (!exist) {
        console.log('Directory does not exist, creating directory');
        return fs.mkdir(dir, error => {
          if (error) {
            console.error('Error creating directory:', error);
          }
          cb(error, dir);
        });
      }
      console.log('Directory exists');
      return cb(null, dir);
    });
  },
  filename: function(req, file, cb) {
    console.log('In filename function');
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }});
const upload = multer({ storage: storage });
const uploadCoverPhoto = multer({ storage: coverPhotoStorage });

module.exports = {
  upload,
  uploadCoverPhoto

};