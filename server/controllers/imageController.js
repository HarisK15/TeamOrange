const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define a Mongoose schema and model for the images
const imageSchema = new mongoose.Schema({
  img: { data: Buffer, contentType: String }
});

const Image = mongoose.model('Image', imageSchema);


// image.js
// Your existing code...

module.exports = {
	upload,
	Image
  };