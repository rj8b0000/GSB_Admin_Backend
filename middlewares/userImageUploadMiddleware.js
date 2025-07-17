const multer = require("multer");

const storage = multer.memoryStorage(); // Store in memory for processing or uploading to cloud

const uploadUserImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB per image
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, and WEBP images are allowed."));
    }
  },
}).single("photo"); // Accept a single file with field name `image`

module.exports = uploadUserImage;
