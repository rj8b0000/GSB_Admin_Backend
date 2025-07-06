const express = require('express');
const router = express.Router();

const {addTeamMember, getAllTeamMembers, getAssignedChats} = require('../controllers/teamController');


router.post('/add-member', addTeamMember);
router.get('/all-members', getAllTeamMembers); 
router.get('/team-members/:memberId/assigned-chats', getAssignedChats);
module.exports = router;
