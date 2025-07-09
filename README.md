# NeighborFit 🏠

A sophisticated neighborhood-lifestyle matching platform that helps users find their perfect neighborhood based on their lifestyle preferences, budget, and personal requirements.

## 🌟 Features

### Core Functionality
- **Smart Matching Algorithm**: AI-powered matching system that analyzes 6 key lifestyle metrics
- **Comprehensive Neighborhood Database**: Detailed information on neighborhoods across major Indian cities
- **Personalized Recommendations**: Tailored suggestions based on user preferences and demographics
- **Advanced Filtering**: Filter by budget, city, match score, and more
- **Community Reviews**: Read and write authentic neighborhood reviews
- **Interactive Dashboard**: Visual representation of matches and preferences

### Key Metrics Analyzed
- **Safety & Security** (25% weight)
- **Affordability** (20% weight)
- **Cleanliness** (15% weight)
- **Walkability** (15% weight)
- **Public Transport** (15% weight)
- **Nightlife & Entertainment** (10% weight)

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API calls
- **Custom CSS** with CSS variables for theming

## 📁 Project Structure

```
neighborfit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   └── services/           # Business logic services
└── package.json            # Root package.json for workspaces
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd neighborfit
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

### 3. Environment Configuration

Create `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/neighborfit
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
PORT=8000
```

Create `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:8000/api
```

### 4. Database Setup

Seed the database with sample neighborhoods:
```bash
cd server
npm run seed
```

### 5. Start the Application

**Development Mode:**
```bash
# Start both client and server concurrently
npm run dev:client    # Terminal 1
npm run dev:server    # Terminal 2
```

**Or start individually:**
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm run dev
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Create/update preferences
- `DELETE /api/preferences` - Delete preferences
- `GET /api/preferences/status` - Get completion status

### Neighborhoods
- `GET /api/neighborhoods` - Get all neighborhoods (with filtering)
- `GET /api/neighborhoods/:id` - Get neighborhood by ID
- `GET /api/neighborhoods/cities` - Get available cities
- `GET /api/neighborhoods/search` - Search neighborhoods
- `GET /api/neighborhoods/matches` - Get personalized matches (protected)
- `GET /api/neighborhoods/:id/match-details` - Get detailed match analysis (protected)
- `POST /api/neighborhoods/:id/reviews` - Add neighborhood review (protected)

## 🧮 Matching Algorithm

The NeighborFit matching algorithm uses a sophisticated weighted scoring system:

### Scoring Process
1. **Lifestyle Compatibility**: Compares user importance ratings with neighborhood scores
2. **Weighted Calculation**: Applies predefined weights to different lifestyle factors
3. **Bonus Points**: Additional points for high ratings and relevant amenities
4. **Normalization**: Ensures scores are within 0-100 range

### Bonus Factors
- **Rating Bonus**: Based on community reviews and overall rating
- **Amenities Bonus**: Extra points for family-friendly amenities (schools, parks)
- **Demographic Match**: Considers family status and age preferences

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette**: Primary blue theme with accent colors
- **Responsive Design**: Mobile-first approach with breakpoints
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: User-friendly error messages and fallbacks

### Key Components
- **Interactive Sliders**: For setting lifestyle preferences
- **Match Cards**: Visual representation of neighborhood matches
- **Metric Bars**: Progress bars showing compatibility scores
- **Filter System**: Advanced filtering with real-time updates

## 📱 Pages & Features

### Public Pages
- **Home**: Landing page with features and call-to-action
- **Neighborhoods**: Browse all neighborhoods with search
- **Neighborhood Detail**: Comprehensive neighborhood information

### Protected Pages
- **Dashboard**: Personalized overview with top matches
- **Preferences**: Set and update lifestyle preferences
- **Matches**: View all personalized neighborhood matches
- **Profile**: User account management

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Client and server-side route protection
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Proper cross-origin request handling

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables for production
3. Build the client application
4. Deploy server to your preferred hosting platform

### Build Commands
```bash
# Build client for production
cd client && npm run build

# Start server in production
cd server && NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📈 Future Enhancements

### Planned Features
- **Map Integration**: Interactive maps with neighborhood boundaries
- **Real-time Data**: Integration with real estate and city data APIs
- **Machine Learning**: Enhanced matching with user behavior analysis
- **Social Features**: User communities and neighborhood discussions
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed insights and recommendations

### Technical Improvements
- **Caching**: Redis for improved performance
- **Search**: Elasticsearch for advanced search capabilities
- **Testing**: Comprehensive unit and integration tests
- **Monitoring**: Application performance monitoring
- **CI/CD**: Automated deployment pipeline

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Full-Stack MERN Application
- **Purpose**: Neighborhood-Lifestyle Matching Platform

## 📞 Support

For support, email [your-email] or create an issue in the repository.

---

**NeighborFit** - Find Your Perfect Neighborhood Match! 🏠✨