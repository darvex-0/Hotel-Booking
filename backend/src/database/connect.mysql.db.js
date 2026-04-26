const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_booking_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then((connection) => {
    console.log('Successfully connected to the MySQL database.');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to the MySQL database. Make sure your XAMPP server is running and the database exists.', err.message);
  });

module.exports = pool;
