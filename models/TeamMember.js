// models/TeamMember.js
const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: String,
  assignedChats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      default: [],
    },
  ],
});

module.exports = mongoose.model('TeamMember', teamMemberSchema);
