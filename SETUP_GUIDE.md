# 🛠️ Beach Resort Setup Guide

This guide provides step-by-step instructions to set up the **Beach Resort | Hotel Room Booking System** on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1.  **Node.js**: [Download Node.js](https://nodejs.org/) (LTS version 18.x or 20.x recommended).
2.  **Git**: [Download Git](https://git-scm.com/downloads).
3.  **MySQL Server**:
    *   **Option A (Recommended for beginners)**: Install [XAMPP](https://www.apachefriends.org/) (which includes MySQL/MariaDB and phpMyAdmin).
    *   **Option B**: Install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
4.  **Code Editor**: [Visual Studio Code](https://code.visualstudio.com/) is recommended.

---

## 🚀 Step 1: Clone the Repository

Open your terminal or command prompt and run the following commands:

```bash
# Clone the repository
git clone https://github.com/your-username/Hotel-Room-Booking-System.git

# Navigate into the project folder
cd Hotel-Room-Booking-System
```

---

## 🗄️ Step 2: Start MySQL Server

1.  **Start your MySQL Server**:
    *   If using XAMPP, open the XAMPP Control Panel and start the **MySQL** module.
2.  **Database Note**:
    *   You **do not** need to create the database manually in phpMyAdmin. The setup script in the next step will create it for you automatically.
    *   Ensure you know your MySQL `root` password (by default, XAMPP has a blank password).

---

## ⚙️ Step 3: Backend Setup

The backend handles the API, authentication, and database interactions.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open `.env` and update your database credentials:
        ```env
        DB_USER = root
        DB_PASSWORD = your_password_here
        DB_NAME = hotel_booking_system
        ```
4.  **Initialize the Database**:
    *   Run the setup script to create tables and seed initial data:
        ```bash
        npm run db:setup
        ```
5.  **Start the Backend**:
    ```bash
    npm run dev
    ```
    *   The server should now be running at `http://localhost:5000`.

---

## 🌐 Step 4: Frontend Setup (Guest Portal)

The frontend is the website where guests can view rooms and make bookings.

1.  Open a **new terminal** window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Ensure `API_BASE_URL` points to your backend:
        ```env
        API_BASE_URL=http://localhost:5000/api/v1
        ```
4.  **Start the Frontend**:
    ```bash
    npm run dev
    ```
    *   The portal will be accessible at `http://localhost:3034`.

---

## 🛠️ Step 5: Admin Panel Setup

The admin panel allows staff to manage rooms, bookings, and users.

1.  Open another **new terminal** window and navigate to the admin-panel directory:
    ```bash
    cd admin-panel
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment variables:
    *   Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Ensure the API URL is correct:
        ```env
        REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
        ```
4.  **Start the Admin Panel**:
    ```bash
    npm start
    ```
    *   The panel will be accessible at `http://localhost:3033`.

---

## 🔑 Default Credentials

Once the database is set up, you can log in with these default accounts:

### Admin Panel
- **Email**: `admin@example.com`
- **Password**: `admin123`

### Frontend (Guest)
- **Email**: `user@gmail.com`
- **Password**: `password`

---

## ❓ Troubleshooting

*   **Database Connection Error**: Double-check your `DB_USER` and `DB_PASSWORD` in `backend/.env`. Ensure MySQL is running.
*   **Port Already in Use**: If port 5000, 3033, or 3034 is busy, you might need to stop other services or change the ports in the respective `.env` files.
*   **Missing Dependencies**: If you see "module not found" errors, try deleting `node_modules` and running `npm install` again.

---
<p align="center">Need help? Contact the development team or check the project documentation.</p>
