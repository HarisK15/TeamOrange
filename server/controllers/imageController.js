const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');

// Set up Multer for image upload
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
	cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Define a Mongoose schema and model for the images
const imageSchema = new mongoose.Schema({
  img: { data: Buffer, contentType: String }
});

const Image = mongoose.model('Image', imageSchema);

// Function to handle image uploading and saving to the database
const uploadImage = async (req, res, next) => {
  // Ensure a file was sent
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Check if uploads directory exists, if not, create it
  const dir = './uploads';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  // Create a new image instance and set the image data to the file that was uploaded
  const newImage = new Image();
  newImage.img.data = fs.readFileSync(req.file.path);
  newImage.img.contentType = req.file.mimetype;

  // Save the image to the database
  try {
    const savedImage = await newImage.save();
    req.body.image = savedImage.id; // Add the image ID to the request body
    next(); // Move to the next middleware (or route handler)
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  upload,
  Image,
  uploadImage
};