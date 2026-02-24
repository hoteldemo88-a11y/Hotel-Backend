const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'hidden'),
    defaultValue: 'available'
  },
  main_image: {
    type: DataTypes.TEXT
  },
  gallery_images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  amenities: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },
  size: {
    type: DataTypes.INTEGER,
    comment: 'Room size in sq ft'
  },
  bed_type: {
    type: DataTypes.STRING,
    comment: 'e.g., King, Queen, Twin'
  },
  floor: {
    type: DataTypes.STRING,
    comment: 'e.g., 1st Floor, 2nd Floor'
  },
  room_number: {
    type: DataTypes.STRING,
    comment: 'Room number for identification'
  },
  max_adults: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },
  max_children: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  include_breakfast: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  cancellation_policy: {
    type: DataTypes.TEXT,
    comment: 'Cancellation policy description'
  },
  check_in_time: {
    type: DataTypes.STRING,
    defaultValue: '2:00 PM'
  },
  check_out_time: {
    type: DataTypes.STRING,
    defaultValue: '12:00 PM'
  }
}, {
  tableName: 'rooms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Room;
