const express = require("express");
const router = express.Router();

const {
  addTeamMember,
  getAllTeamMembers,
  getAssignedChats,
} = require("../controllers/teamController");

// Standard REST routes
router.get("/", getAllTeamMembers);
router.post("/", addTeamMember);
router.get("/all-members", getAllTeamMembers);
router.post("/add-member", addTeamMember);
router.get("/:memberId/assigned-chats", getAssignedChats);
module.exports = router;
