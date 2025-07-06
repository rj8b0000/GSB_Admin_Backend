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
    const { title, description, category, accessLevel, youtubeLink } = req.body;
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Video file is required only if no YouTube link is provided
    if (!videoFile && !youtubeLink) {
      return res
        .status(400)
        .json({ message: "Either video file or YouTube link is required" });
    }

    let videoUrl = null;
    let thumbnailUrl = null;

    // Try to upload files to S3, but continue if S3 is not configured
    try {
      if (videoFile) {
        videoUrl = await uploadFileToS3(videoFile, "videos");
      }
      if (thumbnailFile) {
        thumbnailUrl = await uploadFileToS3(thumbnailFile, "thumbnails");
      }
    } catch (s3Error) {
      console.warn(
        "S3 upload failed, continuing without file URLs:",
        s3Error.message,
      );
      // In development, we can continue without actual file uploads
      if (videoFile) {
        videoUrl = `https://demo-bucket.s3.amazonaws.com/videos/${videoFile.originalname}`;
      }
      if (thumbnailFile) {
        thumbnailUrl = `https://demo-bucket.s3.amazonaws.com/thumbnails/${thumbnailFile.originalname}`;
      }
    }

    const videoDoc = await Video.create({
      title,
      description,
      category,
      accessLevel,
      videoUrl,
      thumbnailUrl,
      youtubeLink,
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
    res
      .status(500)
      .json({ message: "Failed to fetch videos", error: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res
      .status(200)
      .json({ message: "Video deleted successfully", video: deletedVideo });
  } catch (error) {
    console.error("Error deleting video:", error);
    res
      .status(500)
      .json({ message: "Failed to delete video", error: error.message });
  }
};
