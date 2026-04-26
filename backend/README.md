# 🚀 Beach Resort - Backend API

This is the robust RESTful API powering the Beach Resort Hotel Booking System. Built with Node.js, Express, and MySQL, it handles authentication, room management, booking logic, and guest reviews.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2/promise`)
- **Security**: JWT, Bcrypt.js, Helmet, Express Rate Limit
- **Logging**: Winston & Morgan
- **Email**: Nodemailer (SMTP)
- **File Uploads**: Multer

## 📦 Key Dependencies

- `express`: Core web framework
- `mysql2`: Database driver
- `jsonwebtoken`: Authentication tokens
- `bcryptjs`: Password hashing
- `winston`: Application logging
- `nodemailer`: Email delivery service

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file based on the `.env.example` (or existing `.env`) with your MySQL credentials and JWT secrets.

3. **Database Setup**:
   Ensure your MySQL server is running and run the setup script:
   ```bash
   npm run db:setup
   ```

4. **Start the Server**:
   ```bash
   npm run dev  # Development mode
   npm start    # Production mode
   ```

## 🛣️ API Endpoints Summary

- **Auth**: `/api/v1/auth/*` (Registration, Login, Reset Password)
- **Users**: `/api/v1/user/*` (Profile, Avatar Update)
- **Rooms**: `/api/v1/room/*` (List, Create, Edit, Delete)
- **Bookings**: `/api/v1/booking/*` (Place Order, Cancel, Admin Management)
- **Reviews**: `/api/v1/review/*` (Add, List)

---
Developed for Beach Resort Management System.
