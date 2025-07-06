const Chat = require("../models/Chat");
const TeamMember = require("../models/TeamMember");
const mongoose = require("mongoose");

exports.createChat = async (req, res) => {
  try {
    const { customerName, customerEmail, message } = req.body;

    const newChat = new Chat({
      customerName,
      customerEmail,
      messages: [{ sender: "customer", text: message }],
    });

    await newChat.save();
    res.status(201).json({ message: "Chat initiated", data: newChat });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create chat", error: error.message });
  }
};
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find().populate(
      "assignedTo",
      "fullName email department",
    );
    res
      .status(200)
      .json({ message: "Chats fetched", count: chats.length, data: chats });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch chats", error: err.message });
  }
};

exports.assignChat = async (req, res) => {
  try {
    const { chatId, memberId } = req.body;

    const chat = await Chat.findById(chatId);
    const member = await TeamMember.findById(memberId);

    if (!chat || !member) {
      return res.status(404).json({ message: "Chat or team member not found" });
    }

    chat.assignedTo = memberId;
    await chat.save();

    member.assignedChats.push(chat._id);
    await member.save();

    res.status(200).json({ message: "Chat assigned successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to assign chat", error: err.message });
  }
};

exports.getAssignedChats = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await TeamMember.findById(memberId).populate({
      path: "assignedChats",
      select: "customerName status createdAt messages",
    });

    if (!member) {
      return res.status(404).json({ message: "Team member not found" });
    }

    res.status(200).json({
      message: "Assigned chats fetched successfully",
      count: member.assignedChats.length,
      data: member.assignedChats,
    });
  } catch (err) {
    console.error("Error fetching assigned chats:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch assigned chats", error: err.message });
  }
};

// Create or continue a chat from user side
exports.sendMessage = async (req, res) => {
  const { customerName, customerEmail, text, chatType = "general" } = req.body;

  try {
    let chat = await Chat.findOne({ customerEmail, status: "open" });

    if (!chat) {
      chat = await Chat.create({
        customerName,
        customerEmail,
        chatType,
        messages: [{ sender: "customer", text }],
      });
    } else {
      chat.messages.push({ sender: "customer", text });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: err.message });
  }
};

// Admin reply
exports.replyToChat = async (req, res) => {
  const { chatId } = req.params;
  const { text, agentId } = req.body;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID format" });
    }

    // Validate required fields
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Message text is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ sender: "agent", text: text.trim() });

    // Only update assignedTo if agentId is provided
    if (agentId) {
      chat.assignedTo = agentId;
    }

    await chat.save();

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in replyToChat:", err);
    res.status(500).json({ message: "Reply failed", error: err.message });
  }
};

// Get specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID format" });
    }

    const chat = await Chat.findById(chatId).populate("assignedTo");
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error in getChatById:", err);
    res
      .status(500)
      .json({ message: "Error fetching chat", error: err.message });
  }
};

// Resolve a chat
exports.markChatResolved = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndUpdate(
      req.params.chatId,
      { status: "resolved" },
      { new: true },
    );
    res.status(200).json({ message: "Chat marked as resolved", chat });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to mark chat as resolved", error: err.message });
  }
};
