-- ============================================================
-- Hotel Room Booking System - MySQL Schema
-- Migration from MongoDB (NoSQL) to MySQL (Relational)
-- ============================================================

CREATE DATABASE IF NOT EXISTS hotel_booking_system;
USE hotel_booking_system;

-- Drop tables in reverse order of foreign keys
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS booking_dates;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS room_facilities;
DROP TABLE IF EXISTS room_images;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

-- ============================================================
-- Table 1: users
-- ============================================================
CREATE TABLE users (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    userName               VARCHAR(100) UNIQUE NOT NULL,
    fullName               VARCHAR(150) NOT NULL,
    email                   VARCHAR(150) UNIQUE NOT NULL,
    phone                   VARCHAR(20) UNIQUE,
    password                VARCHAR(255) NOT NULL,
    avatar                  VARCHAR(500),
    gender                  ENUM('male', 'female'),
    dob                     DATE NOT NULL,
    address                 TEXT NOT NULL,
    role                    ENUM('admin', 'user') DEFAULT 'user',
    verified                BOOLEAN DEFAULT FALSE,
    status                  ENUM('register', 'login', 'logout', 'blocked') DEFAULT 'register',
    resetPasswordToken      VARCHAR(255),
    resetPasswordExpire     DATETIME,
    emailVerificationToken  VARCHAR(255),
    emailVerificationExpire DATETIME,
    createdAt               TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt               TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Table 2: rooms
-- ============================================================
CREATE TABLE rooms (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    room_name           VARCHAR(150) UNIQUE NOT NULL,
    room_slug           VARCHAR(200) UNIQUE NOT NULL,
    room_type           ENUM('single', 'couple', 'family', 'presidential') NOT NULL,
    room_price          DECIMAL(10, 2) NOT NULL,
    room_size           INT NOT NULL,
    room_capacity       INT NOT NULL,
    allow_pets          BOOLEAN DEFAULT FALSE,
    provide_breakfast   BOOLEAN DEFAULT FALSE,
    featured_room       BOOLEAN DEFAULT FALSE,
    room_description    TEXT NOT NULL,
    room_status         ENUM('available', 'unavailable', 'booked') DEFAULT 'available',
    created_by          INT NOT NULL,
    createdAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt           TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Table 3: room_images
-- ============================================================
CREATE TABLE room_images (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    room_id     INT NOT NULL,
    url         VARCHAR(500) NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- ============================================================
-- Table 4: room_facilities
-- ============================================================
CREATE TABLE room_facilities (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    room_id     INT NOT NULL,
    facility    VARCHAR(255) NOT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- ============================================================
-- Table 5: bookings
-- ============================================================
CREATE TABLE bookings (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    room_id         INT NOT NULL,
    user_id         INT NOT NULL,
    upi_id          VARCHAR(100),
    transaction_id  VARCHAR(100),
    booking_status  ENUM('pending', 'cancel', 'approved', 'rejected', 'in-reviews', 'completed') DEFAULT 'pending',
    createdAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Table 6: booking_dates
-- ============================================================
CREATE TABLE booking_dates (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    booking_id  INT NOT NULL,
    date        DATE NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ============================================================
-- Table 7: reviews
-- ============================================================
CREATE TABLE reviews (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    room_id     INT NOT NULL,
    booking_id  INT NOT NULL,
    rating      INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    message     TEXT,
    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);
