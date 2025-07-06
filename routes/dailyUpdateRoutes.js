const express = require("express");
const router = express.Router();
const dailyUpdateController = require("../controllers/DailyUpdateController");
const uploadImage = require("../middlewares/imageUploadMiddleware");

router.post("/", uploadImage, dailyUpdateController.addDailyUpdate);
router.get("/", dailyUpdateController.getAllDailyUpdates);

module.exports = router;
