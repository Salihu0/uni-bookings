# Campus Facility Booking System - Deployment Guide

## Overview

This guide explains how to deploy the Campus Facility Booking System to Render.com using the provided render.yaml configuration.

---

## Prerequisites

1. **Render Account**: Create a free account at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **Environment Variables**: Have your database and JWT secrets ready

---

## Step 1: Prepare Your Code

### Backend Deployment Files:
- ✅ `render.yaml` - Render service configuration
- ✅ `package.json` - Dependencies and scripts
- ✅ `start.js` - Application entry point
- ✅ `.env.example` - Environment variable template

### Frontend Deployment Files:
- ✅ `package.json` - Build scripts and dependencies
- ✅ `next.config.js` - Next.js configuration
- ✅ Static build output configured

---

## Step 2: Set Up Environment Variables

### Required Environment Variables:

**Backend Service:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Set to `production`

**Frontend Service:**
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password

### Security Notes:
- Use strong, unique secrets
- Never commit secrets to Git
- Use Render's environment variable service
- Rotate secrets regularly

---

## Step 3: Deploy to Render

### Option A: GitHub Integration (Recommended)

1. **Connect GitHub**:
   - Go to Render dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose branch (usually `main`)

2. **Configure Service**:
   - Name: `campus-booking-api`
   - Root directory: `/campus-booking-system` (backend)
   - Build command: `npm install`
   - Start command: `node start.js`
   - Plan: Free

3. **Add Environment Variables**:
   - Add all required environment variables
   - Use the exact variable names from render.yaml

4. **Deploy Database**:
   - Go to "New +" → "PostgreSQL"
   - Name: `campus-booking-db`
   - Plan: Free
   - Add database user and password

5. **Connect Services**:
   - Go to API service settings
   - Add database connection string
   - Link to the PostgreSQL service

### Option B: Manual Render.yaml Deployment

1. **Create Web Service**:
   ```bash
   # Install Render CLI
   npm install -g render-cli
   
   # Deploy using render.yaml
   render.yaml deploy
   ```

2. **Configure Environment**:
   ```bash
   # Set environment variables
   render env set DATABASE_URL "postgresql://..."
   render env set JWT_SECRET "your-secret-key"
   render env set NODE_ENV "production"
   ```

---

## Step 4: Deploy Frontend

1. **Create Second Web Service**:
   - Name: `campus-booking-frontend`
   - Root directory: `/campus-booking` (frontend)
   - Build command: `npm run build`
   - Static publish path: `.next`

2. **Configure Environment**:
   - `NEXT_PUBLIC_API_URL`: Set to your deployed API URL
   - Example: `https://campus-booking-api.onrender.com`

3. **Update API URL**:
   ```javascript
   // In frontend .env
   NEXT_PUBLIC_API_URL=https://campus-booking-api.onrender.com
   ```

---

## Step 5: Verify Deployment

### Health Checks:

**Backend Health:**
```bash
curl https://campus-booking-api.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Server is running"
}
```

**Frontend Access:**
- Visit: `https://campus-booking-frontend.onrender.com`
- Should load the application interface

### Database Connection:
- Check Render logs for database connection
- Verify tables are created
- Test API endpoints

---

## Step 6: Post-Deployment Configuration

### Custom Domain (Optional):
1. **Add Custom Domain**:
   - Go to service settings
   - Add custom domain
   - Configure DNS records

2. **SSL Certificate**:
   - Render provides automatic SSL
   - HTTPS enforced by default

### Monitoring:
1. **Logs**: Monitor Render service logs
2. **Metrics**: Track response times and errors
3. **Alerts**: Set up downtime notifications

---

## Troubleshooting

### Common Issues:

**Build Failures:**
- Check package.json scripts
- Verify all dependencies are installed
- Review build logs for errors

**Database Connection:**
- Verify DATABASE_URL format
- Check database service status
- Test connection manually

**CORS Issues:**
- Verify frontend URL in environment
- Check CORS configuration in server.js
- Test API from frontend domain

**Environment Variables:**
- Ensure all required variables are set
- Check for typos in variable names
- Use Render's variable validation

---

## Production Considerations

### Performance:
- Enable caching for static assets
- Use CDN for faster content delivery
- Optimize database queries

### Security:
- Use HTTPS in production
- Set secure cookie flags
- Implement rate limiting
- Validate all inputs

### Scaling:
- Monitor resource usage
- Set up horizontal scaling
- Use load balancers for high traffic

---

## Cost Management

### Free Plan Limits:
- **Backend**: 750 hours/month, 512MB RAM
- **Database**: 256MB storage, 90 days retention
- **Frontend**: Static hosting with bandwidth limits

### Upgrade Options:
- **Starter**: $7/month - More resources
- **Standard**: $25/month - Better performance
- **Pro**: $100/month - Full features

---

## Success Criteria

✅ **Deployment Complete When:**
- Backend API responds to health checks
- Frontend loads and authenticates users
- Database connection is stable
- All CRUD operations work
- Availability checking functions
- Custom domain is accessible

---

*Last Updated: March 2, 2026*
