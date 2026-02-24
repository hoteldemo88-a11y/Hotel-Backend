const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Settings } = require('../models');

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { User } = require('../models');
    const user = await User.findByPk(decoded.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findAll();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ where: { key: req.params.key } });
    res.json(setting || { key: req.params.key, value: null });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update or create setting
router.put('/', authAdmin, async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ message: 'Settings object required' });
    }

    for (const [key, value] of Object.entries(settings)) {
      const existing = await Settings.findOne({ where: { key } });
      if (existing) {
        await existing.update({ value: String(value) });
      } else {
        await Settings.create({ key, value: String(value) });
      }
    }

    const allSettings = await Settings.findAll();
    const settingsObj = {};
    allSettings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    res.json({ message: 'Settings updated', settings: settingsObj });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
