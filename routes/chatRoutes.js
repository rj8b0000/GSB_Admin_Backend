const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// Standard REST routes
router.get("/", chatController.getAllChats);
router.post("/", chatController.createChat);
router.post("/assign", chatController.assignChat);
router.get("/chats", chatController.getAllChats);
router.post("/chats", chatController.createChat);
router.put("/chats/assign", chatController.assignChat);

router.get(
  "/team-members/:memberId/assigned-chats",
  chatController.getAssignedChats,
);

router.post("/send", chatController.sendMessage);

// Admin: Reply to a chat
router.post("/:chatId/reply", chatController.replyToChat);

// Get a specific chat by ID
router.get("/:chatId", chatController.getChatById);

// Mark chat as resolved
router.put("/:chatId/resolve", chatController.markChatResolved);

module.exports = router;
