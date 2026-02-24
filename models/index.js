const sequelize = require('../config/database');
const User = require('./User');
const Room = require('./Room');
const Settings = require('./Settings');

module.exports = {
  sequelize,
  User,
  Room,
  Settings
};
