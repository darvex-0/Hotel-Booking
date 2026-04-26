# 🏖️ Beach Resort | Hotel Room Booking System

A premium full-stack hotel management and reservation system built with modern technologies. This application provides a complete solution for luxury resorts to manage bookings, rooms, and guests efficiently.

## ✨ Key Features

- **Luxury User Interface**: A stunning, responsive design optimized for high-end resort experiences.
- **Secure Authentication**: JWT-based secure login and registration system.
- **Room Management**: Comprehensive room categorization with advanced filtering and search.
- **Booking Engine**: Sophisticated date-based booking system with real-time validation.
- **Admin Dashboard**: Powerful analytics and management tools for resort operators.
- **Review System**: Integrated guest feedback and rating platform.

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MySQL
- **Frontend**: Next.js 13, React, Redux Toolkit
- **Admin Panel**: React, Ant Design, Tailwind CSS
- **Features**: JWT Auth, Winston Logging, Morgan Middleware, MySQL2

## 🚀 Fresh Setup Guide

Follow these steps to get the system running on a new machine:

### 1. Prerequisites
- **Node.js**: [Download & Install Node.js](https://nodejs.org/) (LTS version recommended).
- **MySQL Server**: Install [XAMPP](https://www.apachefriends.org/) or [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).

### 2. Configure the Database
1. Open your MySQL tool (e.g., phpMyAdmin in XAMPP).
2. Create a new database named `hotel_booking_system`.
3. (Optional) You can import the `backend/schema.sql` if you want to set it up manually, but the setup script handles this.

### 3. Setup Backend
```bash
cd backend
npm install
# Copy the example env and fill in your MySQL credentials
cp .env.example .env
# Run the database initialization script
npm run db:setup
# Start the server
npm run dev
```

### 4. Setup Frontend (Guest Portal)
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

### 5. Setup Admin Panel
```bash
cd ../admin-panel
npm install
cp .env.example .env
npm start
```

## 📝 Environment Variable Tips
- **Backend `.env`**: Make sure `DB_USER` and `DB_PASSWORD` match your local MySQL settings.
- **Frontend/Admin `.env`**: Ensure `API_BASE_URL` matches the URL where your backend is running (usually `http://localhost:5000/api/v1`).


## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<p align="center">Made with ❤️ for Beach Resort</p>
