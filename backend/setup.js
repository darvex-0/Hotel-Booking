/**
 * @name Hotel Room Booking System
 * @description Script to setup MySQL database, tables, seed initial data, and copy assets automatically
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });

function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or exists
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        const curTarget = path.join(targetFolder, file);
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

async function setupDatabase() {
  console.log('🚀 Starting Database Setup & Seeding...');

  // 1. Connect to MySQL without database selection first
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Crucial for executing schema.sql
  });

  try {
    const dbName = process.env.DB_NAME || 'hotel_booking_system';

    console.log(`📂 Creating database: ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName};`);
    await connection.query(`USE ${dbName};`);

    console.log('📜 Reading schema.sql...');
    const schemaPath = path.join(__dirname, './schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🏗️ Creating tables...');
    await connection.query(schemaSql);
    console.log('✅ Tables created successfully!');

    // 4. Migration: Ensure UPI columns exist (in case schema.sql was old or modified)
    console.log('🛠️ Checking for UPI payment columns...');
    try {
      await connection.query(`
        ALTER TABLE bookings 
        ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100) AFTER user_id,
        ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100) AFTER upi_id;
      `);
      console.log('✅ UPI payment columns verified!');
    } catch (err) {
      // Fallback for older MySQL versions that don't support ADD COLUMN IF NOT EXISTS
      try {
        await connection.query('ALTER TABLE bookings ADD COLUMN upi_id VARCHAR(100) AFTER user_id, ADD COLUMN transaction_id VARCHAR(100) AFTER upi_id;');
        console.log('✅ UPI payment columns added!');
      } catch (innerErr) {
        if (innerErr.code === 'ER_DUP_FIELDNAME') {
          console.log('ℹ️ UPI payment columns already exist.');
        } else {
          console.warn('⚠️ Warning during migration:', innerErr.message);
        }
      }
    }

    // 5. Seed Users
    console.log('👤 Seeding users...');
    const bcrypt = require('bcryptjs');
    
    const adminHashedPassword = await bcrypt.hash('admin123', 8);
    const adminData = {
      userName: 'admin',
      fullName: 'System Administrator',
      email: 'admin@example.com',
      password: adminHashedPassword,
      dob: '1990-01-01',
      address: 'System Default Address',
      role: 'admin',
      verified: true,
      status: 'login'
    };

    const [adminResult] = await connection.query(
      `INSERT INTO users (${Object.keys(adminData).join(', ')}) VALUES (${Object.keys(adminData).map(() => '?').join(', ')})`,
      Object.values(adminData)
    );
    const adminId = adminResult.insertId;
    console.log('✨ Admin user created: admin / admin123');

    const userHashedPassword = await bcrypt.hash('user123', 8);
    const userData = {
      userName: 'Manoop',
      fullName: 'Manoop',
      email: 'manoopk2060@gmail.com',
      phone: '1234567890',
      password: userHashedPassword,
      dob: '1995-05-15',
      address: '123 Guest Lane, NY',
      role: 'user',
      verified: false,
      status: 'login'
    };

    const [userResult] = await connection.query(
      `INSERT INTO users (${Object.keys(userData).join(', ')}) VALUES (${Object.keys(userData).map(() => '?').join(', ')})`,
      Object.values(userData)
    );
    const userId = userResult.insertId;
    console.log('✨ Regular user created: john / user123');

    // 6. Seed Rooms
    console.log('🏨 Seeding rooms...');
    const rooms = [
      {
        room_name: "Single Deluxe Room",
        room_slug: "single-deluxe-room",
        room_type: "single",
        room_price: 100.00,
        room_size: 250,
        room_capacity: 1,
        allow_pets: false,
        provide_breakfast: true,
        featured_room: true,
        room_description: "Experience premium comfort in our Single Deluxe Room. Designed specifically for solo travelers looking for luxury and utility, this room features a spacious bed, an ergonomic workspace, and high-speed internet connectivity.",
        room_status: "available",
        created_by: adminId,
        facilities: ["Free Wifi", "Air Conditioner", "Flat-Screen TV", "Mini Bar", "Safe Box"],
        images: ["/images/jpeg/room-1.jpeg", "/images/jpeg/details-1.jpeg", "/images/jpeg/details-2.jpeg"]
      },
      {
        room_name: "Couple Suite Room",
        room_slug: "couple-suite-room",
        room_type: "couple",
        room_price: 180.00,
        room_size: 350,
        room_capacity: 2,
        allow_pets: true,
        provide_breakfast: true,
        featured_room: true,
        room_description: "Perfect for couples seeking a romantic getaway, the Couple Suite Room offers spectacular views, a plush king-sized bed, cozy seating area, and elegant modern decor to make your stay memorable.",
        room_status: "available",
        created_by: adminId,
        facilities: ["Free Wifi", "Air Conditioner", "Flat-Screen TV", "Mini Bar", "Room Service", "Balcony"],
        images: ["/images/jpeg/room-2.jpeg", "/images/jpeg/details-3.jpeg", "/images/jpeg/details-4.jpeg"]
      },
      {
        room_name: "Family Luxury Room",
        room_slug: "family-luxury-room",
        room_type: "family",
        room_price: 250.00,
        room_size: 500,
        room_capacity: 4,
        allow_pets: true,
        provide_breakfast: true,
        featured_room: false,
        room_description: "Our Family Luxury Room provides ample space for the entire family. Features multiple beds, child-friendly amenities, and a separate living space for bonding and relaxation.",
        room_status: "available",
        created_by: adminId,
        facilities: ["Free Wifi", "Air Conditioner", "Flat-Screen TV", "Mini Fridge", "Kid Friendly", "Kitchenette"],
        images: ["/images/jpeg/room-3.jpeg", "/images/jpeg/details-1.jpeg", "/images/jpeg/details-3.jpeg"]
      },
      {
        room_name: "Presidential Suite Room",
        room_slug: "presidential-suite-room",
        room_type: "presidential",
        room_price: 500.00,
        room_size: 850,
        room_capacity: 6,
        allow_pets: false,
        provide_breakfast: true,
        featured_room: true,
        room_description: "Indulge in unparalleled opulence in our Presidential Suite. A magnificent bedroom, spacious private lounge, premium bath facilities, and dedicated butler service await you.",
        room_status: "available",
        created_by: adminId,
        facilities: ["Free Wifi", "Air Conditioner", "Flat-Screen TV", "Mini Bar", "Room Service", "Balcony", "Jacuzzi", "Ocean View"],
        images: ["/images/jpeg/room-4.jpeg", "/images/jpeg/details-2.jpeg", "/images/jpeg/details-4.jpeg"]
      }
    ];

    const seededRooms = [];

    for (const r of rooms) {
      const roomData = {
        room_name: r.room_name,
        room_slug: r.room_slug,
        room_type: r.room_type,
        room_price: r.room_price,
        room_size: r.room_size,
        room_capacity: r.room_capacity,
        allow_pets: r.allow_pets,
        provide_breakfast: r.provide_breakfast,
        featured_room: r.featured_room,
        room_description: r.room_description,
        room_status: r.room_status,
        created_by: r.created_by
      };

      const [roomRes] = await connection.query(
        `INSERT INTO rooms (${Object.keys(roomData).join(', ')}) VALUES (${Object.keys(roomData).map(() => '?').join(', ')})`,
        Object.values(roomData)
      );
      const roomId = roomRes.insertId;
      seededRooms.push({ id: roomId, ...r });

      // Seed room images
      for (const imgUrl of r.images) {
        await connection.query(
          `INSERT INTO room_images (room_id, url) VALUES (?, ?)`,
          [roomId, imgUrl]
        );
      }

      // Seed room facilities
      for (const fac of r.facilities) {
        await connection.query(
          `INSERT INTO room_facilities (room_id, facility) VALUES (?, ?)`,
          [roomId, fac]
        );
      }
    }
    console.log('✨ Seeded 4 rooms, images, and facilities.');

    // 7. Seed Bookings, Booking Dates, and Reviews
    console.log('📅 Seeding bookings and reviews...');
    
    // Booking 1: Completed, has review
    const booking1Data = {
      room_id: seededRooms[0].id,
      user_id: userId,
      upi_id: 'john@upi',
      transaction_id: 'TXN10000001',
      booking_status: 'completed'
    };
    const [b1Res] = await connection.query(
      `INSERT INTO bookings (${Object.keys(booking1Data).join(', ')}) VALUES (${Object.keys(booking1Data).map(() => '?').join(', ')})`,
      Object.values(booking1Data)
    );
    const b1Id = b1Res.insertId;

    // Add dates for Booking 1 (in the past)
    const b1Dates = ['2026-05-10', '2026-05-11', '2026-05-12'];
    for (const d of b1Dates) {
      await connection.query(`INSERT INTO booking_dates (booking_id, date) VALUES (?, ?)`, [b1Id, d]);
    }

    // Add review for Booking 1
    const review1Data = {
      user_id: userId,
      room_id: seededRooms[0].id,
      booking_id: b1Id,
      rating: 5,
      message: "Excellent experience! The Single Deluxe room was clean, quiet, and extremely cozy. The room service was top-notch."
    };
    const [rev1Res] = await connection.query(
      `INSERT INTO reviews (${Object.keys(review1Data).join(', ')}) VALUES (${Object.keys(review1Data).map(() => '?').join(', ')})`,
      Object.values(review1Data)
    );
    const rev1Id = rev1Res.insertId;

    // The review is dynamically linked back to booking via booking_id in reviews table, no bookings.reviews column exists.

    // Booking 2: In-Reviews (ready for review by logged-in user)
    const booking2Data = {
      room_id: seededRooms[1].id,
      user_id: userId,
      upi_id: 'john@upi',
      transaction_id: 'TXN10000002',
      booking_status: 'in-reviews'
    };
    const [b2Res] = await connection.query(
      `INSERT INTO bookings (${Object.keys(booking2Data).join(', ')}) VALUES (${Object.keys(booking2Data).map(() => '?').join(', ')})`,
      Object.values(booking2Data)
    );
    const b2Id = b2Res.insertId;

    // Add dates for Booking 2 (in the past)
    const b2Dates = ['2026-05-20', '2026-05-21'];
    for (const d of b2Dates) {
      await connection.query(`INSERT INTO booking_dates (booking_id, date) VALUES (?, ?)`, [b2Id, d]);
    }

    // Booking 3: Approved (future dates)
    const booking3Data = {
      room_id: seededRooms[2].id,
      user_id: userId,
      upi_id: 'john@upi',
      transaction_id: 'TXN10000003',
      booking_status: 'approved'
    };
    const [b3Res] = await connection.query(
      `INSERT INTO bookings (${Object.keys(booking3Data).join(', ')}) VALUES (${Object.keys(booking3Data).map(() => '?').join(', ')})`,
      Object.values(booking3Data)
    );
    const b3Id = b3Res.insertId;

    // Add dates for Booking 3 (in the future)
    const b3Dates = ['2026-06-15', '2026-06-16'];
    for (const d of b3Dates) {
      await connection.query(`INSERT INTO booking_dates (booking_id, date) VALUES (?, ?)`, [b3Id, d]);
    }

    console.log('✨ Seeded bookings, booking dates, and reviews successfully!');

    // 8. Copy assets from frontend to backend public folder
    console.log('🖼️ Copying room images from frontend to backend...');
    const srcImagesDir = path.join(__dirname, '../frontend/public/images');
    const destPublicDir = path.join(__dirname, './public');

    if (fs.existsSync(srcImagesDir)) {
      copyFolderRecursiveSync(srcImagesDir, destPublicDir);
      console.log('✅ Room images copied successfully!');
    } else {
      console.warn('⚠️ Warning: Frontend images directory not found at:', srcImagesDir);
    }

    console.log('🎉 Database setup and seeding complete!');
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();
