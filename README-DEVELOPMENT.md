# NeighborFit Development Guide

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Starting the Application

1. **Using the development script (Recommended):**
   ```bash
   ./start-dev.sh
   ```

2. **Manual startup:**
   ```bash
   # Terminal 1 - Start backend server
   cd server && npm run dev

   # Terminal 2 - Start frontend client
   cd client && npm run dev
   ```

### Application URLs
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Health Check:** http://localhost:8000

### Database Setup

1. **Seed the database with sample neighborhoods:**
   ```bash
   cd server && npm run seed
   ```

This will populate the database with 8 sample neighborhoods across 5 Indian cities:
- Bangalore: Koramangala, Indiranagar, Whitefield
- Mumbai: Bandra West, Powai
- Delhi: Connaught Place
- Gurgaon: Sector 29
- Chennai: Anna Nagar

### API Endpoints

- `GET /api/neighborhoods` - Get all neighborhoods
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Save user preferences

### Environment Configuration

#### Server (.env in server folder):
```
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Client (.env in client folder):
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=NeighborFit
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

### Troubleshooting

#### Port 5000 Conflicts
If you encounter "EADDRINUSE" errors on port 5000:
1. The server is configured to use port 8000 by default
2. Kill any processes using port 5000: `lsof -ti:5000 | xargs kill -9`
3. Ensure your .env files have the correct port configurations

#### MongoDB Connection Issues
1. Ensure MongoDB is running: `brew services start mongodb-community@6.0`
2. Check connection string in server/.env
3. Verify database permissions

#### Frontend Build Issues
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Check that VITE_API_URL points to the correct backend URL

### Development Features

- **Hot Reload:** Both frontend and backend support hot reloading
- **CORS:** Configured for local development
- **Authentication:** JWT-based auth system
- **Database:** MongoDB with Mongoose ODM
- **API Documentation:** RESTful API with JSON responses

### Project Structure

```
neighborfit/
├── client/                 # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth, etc.)
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── server/                # Node.js backend (Express)
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── scripts/          # Utility scripts (seeding, etc.)
│   └── services/         # Business logic services
└── start-dev.sh          # Development startup script
```

### Next Steps for Development

1. **User Authentication:** Test registration and login flows
2. **Preferences System:** Implement user preference collection
3. **Matching Algorithm:** Enhance the neighborhood matching service
4. **UI/UX:** Improve the frontend design and user experience
5. **Data Enhancement:** Add more neighborhoods and detailed metrics
6. **Testing:** Add unit and integration tests
7. **Deployment:** Prepare for production deployment

### Common Commands

```bash
# Install dependencies
npm install                    # Root level
cd client && npm install      # Frontend
cd server && npm install      # Backend

# Development
./start-dev.sh                # Start both servers
cd server && npm run seed     # Seed database

# Testing API endpoints
curl http://localhost:8000                    # Health check
curl http://localhost:8000/api/neighborhoods  # Get neighborhoods