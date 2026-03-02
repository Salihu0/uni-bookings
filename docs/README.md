# Campus Booking System

A full-stack university facility booking system with a Node.js/Express backend and Next.js frontend.

## 🏗️ Architecture Overview

This project consists of two main applications:

- **Backend API** (`campus-booking-system/`) - REST API built with Node.js, Express, and PostgreSQL
- **Frontend Web App** (`campus-booking/`) - Modern React application built with Next.js 14, TypeScript, and TailwindCSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd campus-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=campus_booking
   PORT=5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd campus-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # .env.local is pre-configured — edit if your backend runs elsewhere
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
campus/
├── campus-booking-system/          # Backend API
│   ├── config/
│   │   └── db.js                   # PostgreSQL connection
│   ├── controllers/
│   │   ├── bookingController.js    # Booking logic
│   │   ├── facilityController.js   # Facility management
│   │   └── userController.js       # User authentication
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication
│   ├── models/
│   │   ├── bookingModel.js         # Booking database operations
│   │   ├── facilityModel.js        # Facility database operations
│   │   └── userModel.js            # User database operations
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── bookingRoutes.js        # Booking endpoints
│   │   └── facilityRoutes.js       # Facility endpoints
│   ├── server.js                   # Express server setup
│   └── package.json
│
└── campus-booking/                 # Frontend Web App
    ├── app/
    │   ├── layout.tsx              # Root layout
    │   ├── page.tsx                # Dashboard
    │   ├── facilities/             # Facility pages
    │   ├── bookings/               # Booking pages
    │   └── admin/                  # Admin pages
    ├── components/
    │   ├── ui/                     # Reusable UI components
    │   ├── facilities/             # Facility-specific components
    │   └── bookings/               # Booking-specific components
    ├── lib/
    │   ├── api.ts                  # API client
    │   ├── utils.ts                # Utility functions
    │   └── toast.tsx               # Toast notifications
    ├── types/
    │   ├── auth.ts                 # Authentication types
    │   ├── booking.ts              # Booking types
    │   └── facility.ts             # Facility types
    └── package.json
```

## 🔐 Authentication & Authorization

The system uses JWT-based authentication with role-based access control:

- **Users**: Can create, view, and manage their own bookings
- **Admins**: Can manage all bookings, facilities, and users

### JWT Token Structure
```json
{
  "userId": "123",
  "email": "user@university.edu",
  "role": "user|admin",
  "exp": 1640995200
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Facilities Table
```sql
CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  facility_id INTEGER REFERENCES facilities(id),
  user_id INTEGER REFERENCES users(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client

## 📋 Features

### Core Functionality
- ✅ User registration and authentication
- ✅ Facility browsing and management
- ✅ Booking creation with conflict detection
- ✅ Real-time availability calendar
- ✅ Booking history and management
- ✅ Admin dashboard for facility management
- ✅ Role-based access control

### Advanced Features
- ✅ Optimistic UI updates
- ✅ Toast notifications
- ✅ Pagination
- ✅ Form validation with error handling
- ✅ Responsive design
- ✅ TypeScript type safety

## 🔌 API Reference

See [API Documentation](./API_DOCUMENTATION.md) for detailed endpoint documentation.

## 🧪 Testing

### Backend Testing
```bash
cd campus-booking-system
npm test
```

### Frontend Testing
```bash
cd campus-booking
npm run lint
npm run type-check
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build and start the server:
   ```bash
   npm start
   ```

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Start production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review the existing issues
- Create a new issue with detailed information

---

**Built with ❤️ for university campus management**
