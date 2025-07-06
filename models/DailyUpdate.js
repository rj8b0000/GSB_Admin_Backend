const mongoose = require('mongoose');

const DailyUpdateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyUpdate', DailyUpdateSchema); 