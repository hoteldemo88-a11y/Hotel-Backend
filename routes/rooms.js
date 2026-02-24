const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { auth, admin } = require('../middleware/auth');

router.get('/public', roomController.getPublicRooms);
router.get('/stats', auth, admin, roomController.getStats);
router.get('/', auth, admin, roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', auth, admin, roomController.createRoom);
router.put('/:id', auth, admin, roomController.updateRoom);
router.delete('/:id', auth, admin, roomController.deleteRoom);

module.exports = router;
