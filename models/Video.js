const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String},
  thumbnailUrl: String, 
  category: { 
    type: String, 
    enum: ['Meditation', 'Education', 'Success Stories', 'Fitness'], 
    required: true 
  },
  youtubeLink: { type: String },
  accessLevel: { type: String, enum: ['Free', 'Paid'], default: 'Free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
