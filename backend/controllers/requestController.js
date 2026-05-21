const Request = require('../models/Request');
const RequestLog = require('../models/RequestLog');
const WORKFLOW_MATRIX = require('../config/workflow');
const { Op } = require('sequelize'); 
const User = require('../models/User');

exports.createRequest = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const newRequest = await Request.create({
      title,
      description,
      category,
      priority,
      status: 'Submitted',
      createdById: req.user.id
    });

    await RequestLog.create({
      requestId: newRequest.id,
      previousStatus: 'None',
      newStatus: 'Submitted',
      comment: 'Request initialized by creator.',
      updatedById: req.user.id
    });

    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetStatus, comment } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    const request = await Request.findByPk(id);
    if (!request) return res.status(404).json({ message: 'Request not found.' });

    const currentStatus = request.status;

    const rules = WORKFLOW_MATRIX[currentStatus];
    if (!rules) {
      return res.status(400).json({ message: `No valid transitions exist from status: ${currentStatus}` });
    }

    if (!rules.allowedTargets.includes(targetStatus)) {
      return res.status(400).json({ 
        message: `Invalid transition. Cannot jump from '${currentStatus}' straight to '${targetStatus}'.` 
      });
    }

    if (!rules.allowedRoles.includes(userRole)) {
      return res.status(43)
        .json({ message: `Security Block: Roles of type '${userRole}' cannot transition items out of '${currentStatus}'.` });
    }

    const previousStatus = currentStatus;

    request.status = targetStatus;
    await request.save();

    await RequestLog.create({
      requestId: request.id,
      previousStatus,
      newStatus: targetStatus,
      comment: comment || 'Status changed via workflow transition processing.',
      updatedById: userId
    });

    res.json({ message: `Status updated smoothly to ${targetStatus}`, request });
  } catch (error) {
    res.status(500).json({ message: 'Workflow state execution error', error: error.message });
  }
};

exports.getDashboardRequests = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { status, priority, search } = req.query; 

    let queryConditions = {};

    if (role === 'User') {
      queryConditions.createdById = userId;
    } else if (role === 'Manager') {
      queryConditions = {};
    } else if (role === 'Admin') {
      queryConditions = {};
    }

    if (status) queryConditions.status = status;
    if (priority) queryConditions.priority = priority;
    
    if (search) {
      queryConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }

    const requests = await Request.findAll({
      where: queryConditions,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email', 'role'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve dashboard records', error: error.message });
  }
};

exports.getRequestHistoryLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const targetRequest = await Request.findByPk(id);
    if (!targetRequest) return res.status(404).json({ message: 'Target request not found' });

    if (req.user.role === 'User' && targetRequest.createdById !== req.user.id) {
      return res.status(403).json({ message: 'Security Block: Cannot view history data for external files.' });
    }

    const logs = await RequestLog.findAll({
      where: { requestId: id },
      include: [
        { model: User, as: 'modifier', attributes: ['id', 'name', 'role'] }
      ],
      order: [['createdAt', 'ASC']] 
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to extract history traces', error: error.message });
  }
};