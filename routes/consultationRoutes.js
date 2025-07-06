// routes/consultancyRoutes.js
const express = require('express');
const router = express.Router();

const {
  submitConsultancyRequest,
  getAllConsultancyRequests, getConsultancyRequestById, updateConsultancyRequest
} = require('../controllers/consultationController');

router.post('/submit', submitConsultancyRequest); // For app
 
router.get('/all', getAllConsultancyRequests);
router.get('/:id', getConsultancyRequestById);  // For admin panel

router.patch('/:id', updateConsultancyRequest);


module.exports = router;
