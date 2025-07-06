const Video = require("../models/Video");
const { uploadFileToS3 } = require("../services/s3Uploader");

// exports.uploadVideo = async (req, res) => {
//   try {
//     const { title, description, category, accessLevel } = req.body;
//     const videoFile = req.files?.video?.[0];
//     const thumbnailFile = req.files?.thumbnail?.[0];

//     if (!videoFile) {
//       return res.status(400).json({ message: "Video file is required" });
//     }

//     const videoUrl = await uploadFileToS3(videoFile, "videos");
//     const thumbnailUrl = thumbnailFile ? await uploadFileToS3(thumbnailFile, "thumbnails") : null;

//     const videoDoc = await Video.create({
//       title,
//       description,
//       category,
//       accessLevel,
//       videoUrl,
//       thumbnailUrl,
//     });

//     res.status(201).json({ message: "Video uploaded", video: videoDoc });
//   } catch (error) {
//     console.error("Video Upload Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.uploadVideo = async (req, res) => {
  try {
    const { title, description, category, accessLevel , youtubeLink} = req.body;
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const videoUrl = await uploadFileToS3(videoFile, "videos");
    const thumbnailUrl = thumbnailFile ? await uploadFileToS3(thumbnailFile, "thumbnails") : null;

    const videoDoc = await Video.create({
      title,
      description,
      category,
      accessLevel,
      videoUrl,
      thumbnailUrl,
      youtubeLink
    });

    res.status(201).json({ message: "Video uploaded", video: videoDoc });
  } catch (error) {
    console.error("Video Upload Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Failed to fetch videos", error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({ message: "Video deleted successfully", video: deletedVideo });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ message: "Failed to delete video", error: error.message });
  }
};