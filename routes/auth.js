const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', auth, authController.getMe);
router.put('/change-password/:id', auth, authController.changePassword);
router.get('/users', auth, authController.getAllUsers);

module.exports = router;
