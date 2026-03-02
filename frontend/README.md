# CampusBook — University Facility Booking System

A production-ready frontend for booking university campus facilities, built with **Next.js 14 App Router**, **TypeScript**, **TailwindCSS**, **React Hook Form**, and **Zod**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
# .env.local is pre-configured — edit if your backend runs elsewhere
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
campus-booking/
├── app/
│   ├── layout.tsx              # Root layout (Navbar + ToastProvider)
│   ├── globals.css             # Tailwind + custom animations
│   ├── page.tsx                # Dashboard / Home
│   ├── facilities/
│   │   ├── page.tsx            # Facilities listing with search
│   │   └── [id]/page.tsx       # Facility detail + availability calendar
│   ├── bookings/
│   │   ├── page.tsx            # Booking history with filters + pagination
│   │   └── new/page.tsx        # Create booking with slot conflict detection
│   └── admin/
│       └── facilities/page.tsx # Admin CRUD UI with modal forms
│
├── components/
│   ├── ui/
│   │   ├── index.tsx           # Button, Card, Badge, Input, Select, Modal, etc.
│   │   └── Navbar.tsx          # Top navigation bar
│   ├── facilities/
│   │   ├── FacilityCard.tsx    # Facility card + skeleton
│   │   └── AvailabilityCalendar.tsx  # 7-day slot availability viewer
│   └── bookings/
│       └── BookingRow.tsx      # Table row for booking history
│
├── lib/
│   ├── api.ts                  # Centralized Axios instance + API methods
│   ├── utils.ts                # formatTime, generateTimeSlots, isSlotBooked, etc.
│   └── toast.tsx               # Toast notification context + hook
│
└── types/
    ├── facility.ts             # Facility, CreateFacilityDto, UpdateFacilityDto
    └── booking.ts              # Booking, CreateBookingDto, TimeSlot, BookingStatus
```

---

## 🖥️ Pages

| Route | Description |
|---|---|
| `/` | Dashboard with stats + quick actions + recent bookings |
| `/facilities` | Browse all facilities with search filter |
| `/facilities/:id` | Facility details + 7-day availability calendar |
| `/bookings` | Full booking history with filters, pagination, cancel/delete |
| `/bookings/new` | Create booking with real-time slot conflict detection |
| `/admin/facilities` | Admin CRUD: create, edit, delete facilities via modals |

---

## ✨ Key Features

### Availability Logic
- Generates 30-minute slots from **08:00 to 20:00** (24 slots/day)
- Compares against live booking data from the API
- **Green** = available, **Red** = booked
- Real-time conflict detection in the booking form — blocks submission if overlap found

### Booking Form Validation (Zod + React Hook Form)
- All fields required
- End time must be after start time
- Cannot submit if selected slot is already taken
- Handles `201`, `409` (conflict), `400` (validation) responses

### Optimistic UI Updates
- Cancel and delete actions update the UI **instantly** before the API responds
- Rolls back automatically on error

### Toast Notifications
- `success` / `error` / `warning` / `info` types
- Auto-dismiss after 4 seconds
- Stackable, dismissible

### Pagination
- 10 bookings per page on the `/bookings` route
- Smart prev/next controls

---

## 🔌 API Reference

All calls go through the centralized Axios instance in `lib/api.ts`.

```typescript
// Facilities
facilitiesApi.getAll()
facilitiesApi.getById(id)
facilitiesApi.create(data)
facilitiesApi.update(id, data)
facilitiesApi.delete(id)

// Bookings
bookingsApi.getAll()
bookingsApi.getById(id)
bookingsApi.getByFacility(facility_id)
bookingsApi.create(data)
bookingsApi.update(id, data)
bookingsApi.cancel(id)
bookingsApi.delete(id)
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework |
| TypeScript | Type safety |
| Axios | HTTP client |
| TailwindCSS | Styling |
| React Hook Form | Form state management |
| Zod | Schema validation |
| DM Sans / DM Mono | Typography |

---

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check (no emit)
```
