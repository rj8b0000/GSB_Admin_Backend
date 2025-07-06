const User = require("../models/User");
const DailyUpdate = require("../models/DailyUpdate");
const { uploadFileToS3 } = require("../services/s3Uploader");

exports.createUser = async (req, res) => {
  try {
    const { fullName, phoneNumber, age, weight, height, goal } = req.body;
    let photoUrl = null;
    if (req.file) {
      // Upload image to S3 and get the URL
      photoUrl = await uploadFileToS3(req.file, "users");
    }
    const user = new User({
      fullName,
      phoneNumber,
      age,
      weight,
      height,
      goal,
      photo: photoUrl,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL parameters
    const { fullName, phoneNumber, age, weight, height, goal } = req.body;

    // Prepare update object with only provided fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (age) updateData.age = Number(age);
    if (weight) updateData.weight = Number(weight);
    if (height) updateData.height = Number(height);
    if (goal) updateData.goal = goal;

    // Handle photo upload to S3 if a file is provided
    if (req.file) {
      updateData.photo = await uploadFileToS3(req.file, "users");
    }

    // Find and update user by ID
    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }, // Return updated document and validate schema
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
