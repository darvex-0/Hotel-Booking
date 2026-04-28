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
