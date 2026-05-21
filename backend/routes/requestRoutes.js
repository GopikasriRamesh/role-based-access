const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  updateRequestStatus, 
  getDashboardRequests, 
  getRequestHistoryLogs 
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/dashboard', protect, getDashboardRequests);
router.get('/:id/logs', protect, getRequestHistoryLogs);
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;