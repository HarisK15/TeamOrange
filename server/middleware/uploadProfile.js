const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		const destinationFolder = './profilers/';
		if (!fs.existsSync(destinationFolder)) {
			fs.mkdirSync(destinationFolder, { recursive: true });
		}
		cb(null, destinationFolder);
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
	}
});

const upload = multer({ storage: storage });

module.exports = upload;