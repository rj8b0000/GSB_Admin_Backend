const Story = require("../models/Story");
const { uploadFileToS3 } = require("../services/s3Uploader");

exports.addStory = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.params;
    const beforeImage = req.files["beforeImage"]
      ? req.files["beforeImage"][0]
      : null;
    const afterImage = req.files["afterImage"]
      ? req.files["afterImage"][0]
      : null;

    if (!beforeImage || !afterImage) {
      return res
        .status(400)
        .json({ error: "Both before and after images are required." });
    }

    // Upload images to S3
    const beforeImageUrl = await uploadFileToS3(beforeImage, "stories");
    const afterImageUrl = await uploadFileToS3(afterImage, "stories");

    // Save story to DB (pseudo code, adapt to your model)
    const story = await Story.create({
      title,
      description,
      beforeImageUrl: beforeImageUrl,
      afterImageUrl: afterImageUrl,
      user: id, // if using auth
    });

    res.status(201).json({
      message: "Story added!",
      title,
      description,
      beforeImageUrl,
      afterImageUrl,
      // story,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dailyupdate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image =
      req.files && req.files["image"] ? req.files["image"][0] : null;

    if (!image) {
      return res.status(400).json({ error: "Image is required." });
    }

    // Upload image to S3
    const imageUrl = await uploadFileToS3(image, "stories");

    // Save story to DB (pseudo code, adapt to your model)
    // const story = await Story.create({
    //   title,
    //   description,
    //   imageUrl,
    //   user: req.user._id, // if using auth
    // });

    res.status(201).json({
      message: "Story added!",
      title,
      description,
      imageUrl,
      // story,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Stories fetched successfully",
      stories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stories", error: error.message });
  }
};
