const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  goal: { type: String, required: true },
  photo: { type: String } ,// URL or file path to the uploaded photo
  otp: String,
  otpExpiresAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
