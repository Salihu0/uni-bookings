# Campus Booking System

A Node.js/Express-based REST API for managing campus facility bookings.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

Update the values in `.env` with your PostgreSQL database details.

### 3. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/:id` - Get facility by ID
- `POST /api/facilities` - Create new facility
- `PUT /api/facilities/:id` - Update facility
- `DELETE /api/facilities/:id` - Delete facility

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/facility/:facility_id` - Get bookings by facility
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `DELETE /api/bookings/:id` - Delete booking

### Health Check
- `GET /api/health` - Server health status

## Project Structure
```
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── bookingController.js
│   └── facilityController.js
├── models/
│   ├── bookingModel.js
│   └── facilityModel.js
├── routes/
│   ├── bookingRoutes.js
│   └── facilityRoutes.js
├── .env.example
├── .gitignore
├── server.js              # Express server setup
└── package.json
```

## Technologies
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Node.js** - Runtime environment
- **Nodemon** - Development server with auto-reload
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables management


## Admin Credentials
```
{
    "email": "admin@university.edu",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
}