const WORKFLOW_MATRIX = {
  Submitted: {
    allowedTargets: ['Approved', 'Rejected', 'Needs Clarification'],
    allowedRoles: ['Manager']
  },
  'Needs Clarification': {
    allowedTargets: ['Submitted'],
    allowedRoles: ['User']
  },
  Approved: {
    allowedTargets: ['Closed'],
    allowedRoles: ['Admin']
  },
  Closed: {
    allowedTargets: ['Submitted'],
    allowedRoles: ['Admin']
  }
};

module.exports = WORKFLOW_MATRIX;