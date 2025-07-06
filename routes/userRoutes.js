const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const uploadImage = require("../middlewares/imageUploadMiddleware");

router.post("/create-user", uploadImage, userController.createUser);
router.put("/update-user/:id", uploadImage, userController.updateUser);

// Get user with calculated score
router.get("/:id/score", userController.getUserWithScore);

// Get all users with scores
router.get("/all/scores", userController.getAllUsersWithScores);

module.exports = router;
