const DailyUpdate = require("../models/DailyUpdate");
const { uploadFileToS3 } = require("../services/mockS3Uploader");

exports.addDailyUpdate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image =
      req.files && req.files["image"] ? req.files["image"][0] : null;

    if (!image) {
      return res.status(400).json({ error: "Image is required." });
    }

    const imageUrl = await uploadFileToS3(image, "dailyupdates");

    const updateData = {
      title,
      description,
      imageUrl,
    };

    if (req.user && req.user._id) {
      updateData.user = req.user._id;
    }

    const dailyUpdate = await DailyUpdate.create(updateData);

    res.status(201).json({
      message: "Daily update added!",
      dailyUpdate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDailyUpdates = async (req, res) => {
  try {
    const dailyUpdates = await DailyUpdate.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Daily updates fetched successfully",
      dailyUpdates,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch daily updates", error: error.message });
  }
};
