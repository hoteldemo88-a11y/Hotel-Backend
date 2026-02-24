const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

let galleryImages = [];
let nextId = 1;

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

router.get('/', (req, res) => {
  res.json(galleryImages);
});

router.post('/', authAdmin, (req, res) => {
  const { src, alt } = req.body;
  if (!src) {
    return res.status(400).json({ message: 'Image URL is required' });
  }
  const newImage = {
    id: nextId++,
    src,
    alt: alt || 'Gallery Image'
  };
  galleryImages.push(newImage);
  res.json(newImage);
});

router.post('/multiple', authAdmin, (req, res) => {
  const { images } = req.body;
  if (!images || !Array.isArray(images)) {
    return res.status(400).json({ message: 'Array of images required' });
  }
  if (images.length > 100) {
    return res.status(400).json({ message: 'Maximum 100 images allowed' });
  }
  const newImages = images.map(img => ({
    id: nextId++,
    src: img.src,
    alt: img.alt || 'Gallery Image'
  }));
  galleryImages.push(...newImages);
  res.json(newImages);
});

router.delete('/:id', authAdmin, (req, res) => {
  const { id } = req.params;
  const index = galleryImages.findIndex(img => img.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: 'Image not found' });
  }
  galleryImages.splice(index, 1);
  res.json({ message: 'Image deleted successfully' });
});

router.put('/:id', authAdmin, (req, res) => {
  const { id } = req.params;
  const { src, alt } = req.body;
  const index = galleryImages.findIndex(img => img.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({ message: 'Image not found' });
  }
  if (src) galleryImages[index].src = src;
  if (alt) galleryImages[index].alt = alt;
  res.json(galleryImages[index]);
});

module.exports = router;
