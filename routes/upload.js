const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const { cloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

router.post('/', authAdmin, (req, res) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      message: 'Image uploaded successfully',
      url: req.file.path,
      public_id: req.file.filename
    });
  });
});

router.post('/multiple', authAdmin, (req, res) => {
  upload.array('images', 100)(req, res, function(err) {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }
    const images = req.files.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    res.json({
      message: 'Images uploaded successfully',
      images
    });
  });
});

router.delete('/destroy', authAdmin, async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) {
    return res.status(400).json({ message: 'Public ID required' });
  }
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ message: 'Image deleted', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting image', error: error.message });
  }
});

module.exports = router;
