# Campus Facility Booking System - Demo Video Script

## Video Overview (3 minutes maximum)

**Title**: "MVC Architecture in Campus Facility Booking System"
**Duration**: 2:45 - 3:00 minutes
**Format**: Screen recording with voice explanation

---

## Script Outline

### Introduction (0:00 - 0:30)
**Visual**: Show system homepage with admin portal access
**Script**: 
"Welcome to this demonstration of our Campus Facility Booking System. Today I'll show how we've implemented Model-View-Controller architecture to create a complete facility management solution.

Let me start by logging in as an administrator to access the management dashboard."

### MVC Architecture Overview (0:30 - 1:00)
**Visual**: Split screen showing:
- Left: Database schema diagram
- Right: File structure (models, controllers, routes)
- Bottom: API endpoint documentation

**Script**:
"Our system follows the MVC pattern for clean separation of concerns. 

On the left, you can see our PostgreSQL database with three main tables: Facilities for campus resources, Users for authentication and roles, and Bookings for reservations.

The Models layer handles all database interactions through facilityModel.js, bookingModel.js, and userModel.js.

The Controllers layer contains our business logic - facilityController.js manages CRUD operations for facilities, bookingController.js handles booking logic and conflict checking, and availabilityController.js provides time slot checking.

The Routes layer defines our RESTful API endpoints, connecting HTTP requests to the appropriate controllers."

### Database Operations Demo (1:00 - 1:30)
**Visual**: Show database with sample data
**Script**:
"Let me demonstrate the database operations. I'll create a new facility called 'Demo Room' in our Engineering Building.

[Show facility creation in admin interface]

You can see the facility is immediately saved to our PostgreSQL database and appears in the facilities list.

Now let me check the availability for this facility on March 15th."

### Availability Checking Demo (1:30 - 2:00)
**Visual**: Show availability endpoint response
**Script**:
"The availability endpoint is a key feature for users. Let me check time slots for our new facility.

[Show API call to /api/availability?facility_id=3&date=2026-03-15]

The response shows 30-minute time slots from 8 AM to 10 PM, with clear indicators of which slots are available or booked. This prevents double-bookings and helps users find optimal times."

### Booking Creation Demo (2:00 - 2:15)
**Visual**: Show booking form and confirmation
**Script**:
"Now let me create a booking. I'll select an available time slot and book this facility for a team meeting.

[Show booking process with form validation]

The booking controller validates the request, checks for conflicts, and creates a new record in the bookings table. The system automatically assigns a 'confirmed' status and sends a success notification."

### Admin Management Features (2:15 - 2:30)
**Visual**: Show admin dashboard with statistics
**Script**:
"The admin dashboard provides a complete overview of the system. You can see statistics for total facilities, bookings, and users.

[Show navigation between different admin sections]

Administrators can manage all aspects of the system through this interface, with role-based access control ensuring only authorized users can make changes."

### Frontend Integration (2:30 - 2:45)
**Visual**: Show frontend components and API integration
**Script**:
"Our React frontend communicates with the backend through RESTful API calls. All user interactions - from viewing facilities to creating bookings - trigger the appropriate API endpoints.

The frontend handles authentication using JWT tokens, displays loading states during API calls, and provides immediate feedback through toast notifications. This creates a smooth user experience."

### Conclusion (2:45 - 3:00)
**Visual**: Show deployed application with custom domain
**Script**:
"To complete the MVC demonstration, let me show our deployed system running on Render.com.

[Show live application with HTTPS URL]

The entire system - from database models to React frontend - is deployed and accessible. The MVC architecture makes it easy to maintain and extend, with clear separation between data access, business logic, and presentation layers.

This implementation showcases how MVC patterns can be used to build robust, scalable web applications with modern technologies like Node.js, Express, PostgreSQL, and React."

---

## Recording Tips

### Technical Setup:
- Use screen recording software (OBS Studio, QuickTime, etc.)
- Record at 1080p resolution
- Include microphone for voice explanation
- Show browser developer tools for API calls

### Content to Highlight:
1. **File Structure**: MVC organization
2. **Database Operations**: Real CRUD functionality
3. **API Endpoints**: RESTful design
4. **Frontend Integration**: React with Axios
5. **Authentication Flow**: JWT implementation
6. **Error Handling**: User feedback systems
7. **Deployment**: Production configuration

### Visual Elements:
- Split-screen comparisons
- Code annotations
- API request/response examples
- Database schema diagrams
- Flow arrows showing data movement

### Key Points to Emphasize:
- **Separation of Concerns**: MVC benefits
- **Scalability**: How architecture supports growth
- **Maintainability**: Easy to update individual components
- **Testing**: How each layer can be tested independently
- **Real-world Application**: Practical booking system features

---

## Files to Reference

During recording, reference these files:
- `/models/facilityModel.js` - Database operations
- `/controllers/facilityController.js` - Business logic
- `/routes/facilityRoutes.js` - API endpoints
- `/server.js` - Application entry point
- `API_DOCUMENTATION_COMPLETE.md` - Complete API reference
- `render.yaml` - Deployment configuration

---

## Post-Recording

1. **Save video** as MP4 (under 100MB for upload)
2. **Upload to GitHub** in repository
3. **Add link** to project documentation
4. **Submit** with other deliverables

---

*Script prepared for MVC demonstration video recording*
