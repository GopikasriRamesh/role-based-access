const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Request = require('./Request');

const RequestLog = sequelize.define('RequestLog', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  previousStatus: { type: DataTypes.STRING, allowNull: false },
  newStatus: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.STRING, defaultValue: '' }
});

RequestLog.belongsTo(Request, { foreignKey: 'requestId', onDelete: 'CASCADE' });
RequestLog.belongsTo(User, { as: 'modifier', foreignKey: 'updatedById' });

module.exports = RequestLog;