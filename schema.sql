-- RoyalStay Database Schema
-- Run this SQL in your MySQL database

CREATE DATABASE IF NOT EXISTS royalstay;
USE royalstay;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'booked', 'hidden') DEFAULT 'available',
  main_image TEXT,
  gallery_images JSON,
  amenities JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Admin User (password: admin123)
-- INSERT INTO users (name, email, password, role) 
-- VALUES ('Admin', 'admin@royalstay.com', '$2a$10$XQ5KJZxSxU7IxO8p5jQ0eO.Jk5xZQxQxQxQxQxQxQxQxQxQxQxQx', 'admin');

-- Sample Rooms
-- INSERT INTO rooms (name, description, price, status, main_image, gallery_images, amenities) VALUES
-- ('Presidential Suite', 'Experience the pinnacle of luxury in our Presidential Suite, featuring panoramic views, private terrace, and world-class amenities.', 2500, 'available', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', '["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800"]', '["Private Butler","Ocean View","Private Terrace","King Bed","Mini Bar","Smart TV","Spa Access"]'),
-- ('Deluxe King Room', 'Spacious room with king bed, modern amenities, and stunning city views.', 450, 'available', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', '[]', '["King Bed","City View","WiFi","Mini Bar","Smart TV"]'),
-- ('Ocean View Suite', 'Wake up to breathtaking ocean views in this elegantly appointed suite.', 850, 'available', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', '[]', '["Ocean View","Balcony","King Bed","Jacuzzi","Room Service"]');
