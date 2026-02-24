require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/gallery');
const settingsRoutes = require('./routes/settings');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RoyalStay API is running' });
});

// Emergency fix - delete all users and create fresh admin
app.get('/api/emergency-fix', async (req, res) => {
  try {
    await User.destroy({ where: {}, force: true });
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await User.create({
      name: 'Admin',
      email: 'admin@royalstay.com',
      password: hashedPassword,
      role: 'admin'
    });
    res.json({ message: 'Fixed!', email: 'admin@royalstay.com', password: 'admin123' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to list users
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@royalstay.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin user created: admin@royalstay.com / admin123');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
};

startServer();
