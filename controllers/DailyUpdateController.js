const DailyUpdate = require("../models/DailyUpdate");
const { uploadFileToS3, deleteFileFromS3 } = require("../services/s3Uploader");

exports.addDailyUpdate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image =
      req.files && req.files["image"] ? req.files["image"][0] : null;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = await uploadFileToS3(image, "dailyupdates");

    const updateData = {
      title,
      description: description || "",
      imageUrl,
    };

    if (req.user && req.user._id) {
      updateData.user = req.user._id;
    }

    const dailyUpdate = await DailyUpdate.create(updateData);

    // Populate user details in the response
    const populatedUpdate = await DailyUpdate.populate(
      "user",
      "fullName email"
    );

    res.status(201).json({
      message: "Daily update added successfully",
      dailyUpdate: populatedUpdate,
    });
  } catch (err) {
    // Clean up S3 file if creation fails
    if (imageUrl) {
      await deleteFileFromS3(imageUrl);
    }
    res
      .status(500)
      .json({ message: "Failed to add daily update", error: err.message });
  }
};

exports.getAllDailyUpdates = async (req, res) => {
  try {
    const dailyUpdates = await DailyUpdate.find()
      .populate("user", "fullName", "email")
      .sort({ createdAt: -1 });

    // Debug logging to check image URLs
    console.log("Fetched daily updates with image URLs:");
    dailyUpdates.forEach((update, index) => {
      console.log(`Update ${index + 1}:`, {
        title: update.title,
        imageUrl: update.imageUrl,
        user: update.user?.fullName || "No user",
      });
    });

    res.status(200).json({
      message: "Daily updates fetched successfully",
      count: dailyUpdates.length,
      dailyUpdates,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch daily updates",
      error: error.message,
    });
  }
};

exports.updateDailyUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const image =
      req.files && req.files["image"] ? req.files["image"][0] : null;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image) {
      // Fetch existing update to delete old image
      const existingUpdate = await DailyUpdate.findById(id);
      if (!existingUpdate) {
        return res.status(404).json({ message: "Daily update not found" });
      }
      // Upload new image and delete old one
      updateData.imageUrl = await uploadFileToS3(image, "dailyupdates");
      if (existingUpdate.imageUrl) {
        await deleteFileFromS3(existingUpdate.imageUrl);
      }
    }

    const dailyUpdate = await DailyUpdate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("user", "fullName email");

    if (!BlaiseUpdate) {
      return res.status(404).json({ message: "Daily update not found" });
    }

    res.status(200).json({
      message: "Daily update updated successfully",
      dailyUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update daily update",
      error: error.message,
    });
  }
};

exports.deleteDailyUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const dailyUpdate = await DailyUpdate.findById(id);
    if (!dailyUpdate) {
      return res.status(404).json({ message: "Daily update not found" });
    }

    // Delete image from S3
    if (dailyUpdate.imageUrl) {
      await deleteFileFromS3(dailyUpdate.imageUrl);
    }

    await DailyUpdate.deleteOne({ _id: id });

    res.status(200).json({ message: "Daily update deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete daily update",
      error: error.message,
    });
  }
};

exports.cleanupDemoDailyUpdates = async (req, res) => {
  try {
    // Remove all daily updates with demo bucket URLs
    const result = await DailyUpdate.deleteMany({
      imageUrl: { $regex: "demo-gsb-bucket" },
    });

    console.log(`Cleaned up ${result.deletedCount} demo daily updates`);

    res.status(200).json({
      message: `Successfully cleaned up ${result.deletedCount} demo daily updates`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cleanup demo daily updates",
      error: error.message,
    });
  }
};

exports.getDailyUpdateOnUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const dailyUpdates = await DailyUpdate.find({ _id: id })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    if (!dailyUpdates || dailyUpdates.length === 0) {
      return res
        .status(404)
        .json({ message: "No daily updates found for this user" });
    }
    res.status(200).json({
      message: "Daily updates fetched successfully",
      count: dailyUpdates.length,
      dailyUpdates,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch daily updates",
      error: error.message,
    });
  }
};
