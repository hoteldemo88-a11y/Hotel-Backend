const { Room } = require('../models');

exports.getAllRooms = async (req, res) => {
  try {
    const { status, minPrice, maxPrice } = req.query;
    
    const where = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[require('sequelize').Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[require('sequelize').Op.lte] = parseFloat(maxPrice);
    }

    const rooms = await Room.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPublicRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll({
      where: {
        status: { [require('sequelize').Op.ne]: 'hidden' }
      },
      order: [['created_at', 'DESC']]
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { 
      name, description, price, status, main_image, gallery_images, amenities,
      capacity, size, bed_type, floor, room_number, max_adults, max_children,
      include_breakfast, cancellation_policy, check_in_time, check_out_time
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Please provide name and price' });
    }

    const room = await Room.create({
      name,
      description,
      price,
      status: status || 'available',
      main_image,
      gallery_images: gallery_images || [],
      amenities: amenities || [],
      capacity: capacity || max_adults + max_children || 2,
      size,
      bed_type,
      floor,
      room_number,
      max_adults: max_adults || 2,
      max_children: max_children || 1,
      include_breakfast: include_breakfast || false,
      cancellation_policy,
      check_in_time: check_in_time || '2:00 PM',
      check_out_time: check_out_time || '12:00 PM'
    });

    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const { 
      name, description, price, status, main_image, gallery_images, amenities,
      capacity, size, bed_type, floor, room_number, max_adults, max_children,
      include_breakfast, cancellation_policy, check_in_time, check_out_time
    } = req.body;

    await room.update({
      name: name || room.name,
      description: description || room.description,
      price: price || room.price,
      status: status || room.status,
      main_image: main_image || room.main_image,
      gallery_images: gallery_images || room.gallery_images,
      amenities: amenities || room.amenities,
      capacity: capacity !== undefined ? capacity : room.capacity,
      size: size !== undefined ? size : room.size,
      bed_type: bed_type || room.bed_type,
      floor: floor || room.floor,
      room_number: room_number !== undefined ? room_number : room.room_number,
      max_adults: max_adults !== undefined ? max_adults : room.max_adults,
      max_children: max_children !== undefined ? max_children : room.max_children,
      include_breakfast: include_breakfast !== undefined ? include_breakfast : room.include_breakfast,
      cancellation_policy: cancellation_policy || room.cancellation_policy,
      check_in_time: check_in_time || room.check_in_time,
      check_out_time: check_out_time || room.check_out_time
    });

    res.json({
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    await room.destroy();

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalRooms = await Room.count();
    const availableRooms = await Room.count({ where: { status: 'available' } });
    const bookedRooms = await Room.count({ where: { status: 'booked' } });
    const hiddenRooms = await Room.count({ where: { status: 'hidden' } });

    res.json({
      totalRooms,
      availableRooms,
      bookedRooms,
      hiddenRooms
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
