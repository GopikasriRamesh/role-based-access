const express = require('express');
const router = express.Router();
const { createRequest, updateRequestStatus } = require('../controllers/requestController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;