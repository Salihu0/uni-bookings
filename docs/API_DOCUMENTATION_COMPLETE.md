# Campus Facility Booking System - API Documentation

## Overview

This document describes the RESTful API endpoints for the Campus Facility Booking System. The system follows MVC architecture and uses JSON for all requests and responses.

**Base URL**: `http://localhost:5001/api`

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user" // optional, defaults to "user"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Invalid credentials
- `500` - Server error

---

### Facility Routes (`/api/facilities`)

#### GET `/api/facilities`
Retrieve all facilities.

**Authentication**: Not required

**Response (200):**
```json
[
  {
    "id": "1",
    "name": "Engineering Auditorium",
    "location": "Engineering Block A",
    "capacity": 200,
    "description": "Large auditorium for events"
  },
  {
    "id": "2", 
    "name": "Science Lab",
    "location": "Building B",
    "capacity": 50,
    "description": "Science laboratory"
  }
]
```

#### GET `/api/facilities/{id}`
Retrieve a specific facility by ID.

**Authentication**: Not required

**Response (200):**
```json
{
  "id": "1",
  "name": "Engineering Auditorium",
  "location": "Engineering Block A", 
  "capacity": 200,
  "description": "Large auditorium for events"
}
```

**Error Responses:**
- `404` - Facility not found
- `500` - Server error

#### POST `/api/facilities`
Create a new facility (admin only).

**Authentication**: Required (Admin role)

**Request Body:**
```json
{
  "name": "New Facility",
  "location": "Building C",
  "capacity": 100,
  "description": "Description of facility"
}
```

**Response (201):**
```json
{
  "id": "3",
  "name": "New Facility",
  "location": "Building C",
  "capacity": 100,
  "description": "Description of facility"
}
```

#### PUT `/api/facilities/{id}`
Update a facility (admin only).

**Authentication**: Required (Admin role)

**Request Body:**
```json
{
  "name": "Updated Facility",
  "location": "Building C, Room 101",
  "capacity": 150,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "id": "3",
  "name": "Updated Facility",
  "location": "Building C, Room 101",
  "capacity": 150,
  "description": "Updated description"
}
```

#### DELETE `/api/facilities/{id}`
Delete a facility (admin only).

**Authentication**: Required (Admin role)

**Response (200):**
```json
{
  "message": "Facility deleted",
  "facility": {
    "id": "3",
    "name": "Updated Facility",
    "location": "Building C, Room 101",
    "capacity": 150,
    "description": "Updated description"
  }
}
```

---

### Booking Routes (`/api/bookings`)

#### GET `/api/bookings`
Retrieve all bookings (admin only).

**Authentication**: Required (Admin role)

**Response (200):**
```json
[
  {
    "id": "1",
    "facility_id": "1",
    "user_id": "2",
    "date": "2026-03-02",
    "start_time": "09:00",
    "end_time": "10:00",
    "status": "confirmed",
    "notes": "Meeting notes"
  }
]
```

#### GET `/api/bookings/{id}`
Retrieve a specific booking by ID.

**Authentication**: Required (Owner or Admin)

**Response (200):**
```json
{
  "id": "1",
  "facility_id": "1",
  "user_id": "2", 
  "date": "2026-03-02",
  "start_time": "09:00",
  "end_time": "10:00",
  "status": "confirmed",
  "notes": "Meeting notes"
}
```

#### POST `/api/bookings`
Create a new booking.

**Authentication**: Required

**Request Body:**
```json
{
  "facility_id": "1",
  "date": "2026-03-15",
  "start_time": "14:00",
  "end_time": "15:00",
  "notes": "Team meeting"
}
```

**Response (201):**
```json
{
  "id": "5",
  "facility_id": "1",
  "user_id": "2",
  "date": "2026-03-15",
  "start_time": "14:00", 
  "end_time": "15:00",
  "status": "confirmed",
  "notes": "Team meeting"
}
```

#### PUT `/api/bookings/{id}`
Update a booking.

**Authentication**: Required (Owner or Admin)

**Request Body:**
```json
{
  "facility_id": "1",
  "date": "2026-03-15",
  "start_time": "15:00",
  "end_time": "16:00",
  "status": "confirmed",
  "notes": "Updated meeting"
}
```

#### DELETE `/api/bookings/{id}`
Cancel/delete a booking.

**Authentication**: Required (Owner or Admin)

**Response (200):**
```json
{
  "message": "Booking deleted",
  "booking": {
    "id": "5",
    "facility_id": "1",
    "user_id": "2",
    "date": "2026-03-15",
    "start_time": "14:00",
    "end_time": "15:00",
    "status": "confirmed",
    "notes": "Team meeting"
  }
}
```

---

### Availability Routes (`/api/availability`)

#### GET `/api/availability`
Check facility availability for a specific date.

**Query Parameters:**
- `facility_id` (required) - Facility ID
- `date` (required) - Date in YYYY-MM-DD format

**Example Request:**
```
GET /api/availability?facility_id=1&date=2026-03-15
```

**Response (200):**
```json
{
  "facility": {
    "id": "1",
    "name": "Engineering Auditorium",
    "location": "Engineering Block A",
    "capacity": 200,
    "description": "Large auditorium for events"
  },
  "date": "2026-03-15",
  "time_slots": [
    {
      "time": "08:00",
      "available": false,
      "booking": {
        "id": "10",
        "facility_id": "1",
        "user_id": "2",
        "date": "2026-03-15",
        "start_time": "08:00",
        "end_time": "09:00",
        "status": "confirmed"
      }
    },
    {
      "time": "08:30",
      "available": true,
      "booking": null
    },
    {
      "time": "09:00", 
      "available": false,
      "booking": {
        "id": "11",
        "facility_id": "1",
        "user_id": "3",
        "date": "2026-03-15",
        "start_time": "09:00",
        "end_time": "10:30",
        "status": "confirmed"
      }
    }
  ],
  "total_slots": 28,
  "available_slots": 15
}
```

**Time Slot Details:**
- **Operating Hours**: 8:00 AM - 10:00 PM
- **Slot Duration**: 30 minutes
- **Total Slots**: 28 per day
- **Available Slots**: Count of slots without bookings
- **Booking Information**: Full booking details for occupied slots

---

## Error Handling

### Standard Error Response Format:
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes:
- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

---

## Data Models

### Facility Model:
```json
{
  "id": "string",
  "name": "string", 
  "location": "string",
  "capacity": "number",
  "description": "string"
}
```

### Booking Model:
```json
{
  "id": "string",
  "facility_id": "string",
  "user_id": "string",
  "date": "string (YYYY-MM-DD)",
  "start_time": "string (HH:MM)",
  "end_time": "string (HH:MM)",
  "status": "string (pending|confirmed|cancelled)",
  "notes": "string"
}
```

### User Model:
```json
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string", 
  "role": "string (user|admin)"
}
```

---

## Usage Examples

### 1. User Registration and Login:
```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","firstName":"John","lastName":"Doe"}'

# Login  
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

### 2. Facility Management:
```bash
# Get all facilities
curl http://localhost:5001/api/facilities

# Create facility (admin)
curl -X POST http://localhost:5001/api/facilities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"New Room","location":"Building A","capacity":30}'
```

### 3. Booking Management:
```bash
# Check availability
curl "http://localhost:5001/api/availability?facility_id=1&date=2026-03-15"

# Create booking
curl -X POST http://localhost:5001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"facility_id":"1","date":"2026-03-15","start_time":"14:00","end_time":"15:00"}'
```

---

## Frontend Integration

The frontend (Next.js) integrates with this API using Axios. Key integration points:

1. **Authentication**: JWT tokens stored in localStorage/context
2. **Error Handling**: Toast notifications for API errors
3. **Loading States**: UI feedback during API calls
4. **Data Refresh**: Automatic updates after CRUD operations

---

## Deployment Notes

### Environment Variables:
```env
PORT=5001
DATABASE_URL=postgresql://username:password@localhost:5432/campus_booking
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### Production Considerations:
- Use HTTPS in production
- Enable CORS for production domain
- Set secure cookie flags
- Use environment-specific database URLs
- Implement rate limiting for API endpoints

---

*Last Updated: March 2, 2026*
