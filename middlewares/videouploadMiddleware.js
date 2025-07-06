const multer = require("multer");

// Store file in memory buffer
const storage = multer.memoryStorage();

// 100MB size limit — adjust if needed
module.exports = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
