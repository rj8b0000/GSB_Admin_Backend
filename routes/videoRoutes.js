// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const videoController = require("../controllers/videoController");
// const { verifyToken } = require("../middlewares/authMiddleware");

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.post(
//   "/upload",
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "thumbnail", maxCount: 1 },
//   ]),
//   videoController.uploadVideo
// );

// module.exports = router;
const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const videoUpload = require("../middlewares/videouploadMiddleware"); // path to the above file

router.post("/", videoUpload, videoController.uploadVideo);
router.post("/upload", videoUpload, videoController.uploadVideo);
router.get("/", videoController.getAllVideos);
router.get("/all-videos", videoController.getAllVideos);
router.delete("/:id", videoController.deleteVideo);
module.exports = router;
