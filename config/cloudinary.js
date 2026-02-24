require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dchjy0hvk',
  api_key: '373115673631775',
  api_secret: 'rjBNynEX6wxyaQBUTmQOC-0HcA0'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'royalstay',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  }
});

module.exports = { cloudinary, storage };
