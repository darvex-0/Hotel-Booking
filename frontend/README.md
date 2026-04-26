# 🏖️ Beach Resort - Guest Portal

The user-facing web portal for Beach Resort guests. Built with Next.js, it offers a premium, fast, and responsive experience for discovering and booking luxury rooms.

## ✨ Features

- **Premium Design**: Modern, responsive UI with glassmorphism and smooth transitions.
- **Dynamic Filtering**: Real-time room filtering by type, capacity, price, and amenities.
- **Booking Flow**: Seamless reservation process with date validation.
- **User Dashboard**: Manage profiles, view booking history, and leave reviews.
- **SEO Optimized**: Fully optimized for search engines using Next.js SEO practices.

## 🛠️ Technology Stack

- **Framework**: Next.js 13
- **State Management**: Redux Toolkit
- **Styling**: Vanilla CSS & Tailwind CSS
- **Notifications**: React Toastify
- **Icons**: React Icons / Font Awesome

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file with the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. **Run the Application**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `/pages`: Next.js routing and page components.
- `/components`: Reusable UI elements (Room cards, Hero, Layouts).
- `/store`: Redux global state management.
- `/styles`: Global and component-specific styling.
- `/utils`: API service helpers and formatters.

---
Part of the Beach Resort Hotel Management Suite.
