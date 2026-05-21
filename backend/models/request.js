const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Request = sequelize.define('Request', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  priority: { 
    type: DataTypes.ENUM('Low', 'Medium', 'High'), 
    defaultValue: 'Medium' 
  },
  status: { 
    type: DataTypes.ENUM('Submitted', 'Needs Clarification', 'Approved', 'Closed'), 
    defaultValue: 'Submitted',
    allowNull: false
  }
});

Request.belongsTo(User, { as: 'creator', foreignKey: 'createdById' });

module.exports = Request;