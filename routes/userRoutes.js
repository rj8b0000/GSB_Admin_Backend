const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const uploadImage = require("../middlewares/imageUploadMiddleware");

router.post("/create-user", uploadImage, userController.createUser);
router.put("/update-user/:id", uploadImage, userController.updateUser);

module.exports = router;
