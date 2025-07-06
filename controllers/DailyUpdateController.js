const DailyUpdate = require('../models/DailyUpdate');
const { uploadFileToS3 } = require('../services/s3Uploader');

exports.addDailyUpdate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.files && req.files['image'] ? req.files['image'][0] : null;

    if (!image) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    const imageUrl = await uploadFileToS3(image, 'dailyupdates');

    const updateData = {
      title,
      description,
      imageUrl
    };

    if (req.user && req.user._id) {
      updateData.user = req.user._id;
    }

    const dailyUpdate = await DailyUpdate.create(updateData);

    res.status(201).json({
      message: 'Daily update added!',
      dailyUpdate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 