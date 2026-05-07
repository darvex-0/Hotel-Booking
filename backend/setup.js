/**
 * @name Hotel Room Booking System
 * @description Script to setup MySQL database and tables automatically
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });

async function setupDatabase() {
  console.log('🚀 Starting Database Setup...');

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

    // Optional: Seed an initial admin user if the table is empty
    const [users] = await connection.query('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      console.log('👤 Seeding initial admin user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 8);

      const adminData = {
        userName: 'admin',
        fullName: 'System Administrator',
        email: 'admin@example.com',
        password: hashedPassword,
        dob: '1990-01-01',
        address: 'System Default Address',
        role: 'admin',
        verified: true,
        status: 'login'
      };

      const keys = Object.keys(adminData);
      const values = Object.values(adminData);
      const placeholders = keys.map(() => '?').join(', ');

      await connection.query(
        `INSERT INTO users (${keys.join(', ')}) VALUES (${placeholders})`,
        values
      );
      console.log('✨ Admin user created: admin / admin123');
    }

    console.log('🎉 Database setup complete!');
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();
