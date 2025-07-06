const TeamMember = require('../models/TeamMember');
const Chat = require('../models/Chat');

exports.addTeamMember = async (req, res) => {
  try {
    const { fullName, email, department } = req.body;
    const defaultPassword = 'gsbpathy123';

    const TeamMember = require('../models/TeamMember');

    // ✅ Check if email already exists
    const existing = await TeamMember.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Team member already exists with this email' });
    }

    const newMember = new TeamMember({
      fullName,
      email,
      password: defaultPassword,
      department,
    });

    await newMember.save();
    res.status(201).json({ message: 'Team member added successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to add team member', error: error.message });
  }
};



exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find({}, 'fullName email department ');
    res.status(200).json({
      message: 'Fetched team members successfully',
      count: teamMembers.length,
      data: teamMembers,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch team members',
      error: err.message,
    });
  }
};



exports.getAssignedChats = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await TeamMember.findById(memberId).populate({
      path: 'assignedChats',
      select: 'customerName status createdAt messages',
    });

    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.status(200).json({
      message: 'Assigned chats fetched successfully',
      count: member.assignedChats.length,
      data: member.assignedChats,
    });
  } catch (err) {
    console.error('Error fetching assigned chats:', err);
    res.status(500).json({ message: 'Failed to fetch assigned chats', error: err.message });
  }
};


