const Request = require('../models/Request');
const RequestLog = require('../models/RequestLog');
const WORKFLOW_MATRIX = require('../config/workflow');

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