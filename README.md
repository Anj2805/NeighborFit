# NeighborFit 🏠

A sophisticated neighborhood-lifestyle matching platform that helps users find their perfect neighborhood based on their lifestyle preferences, budget, and personal requirements.

## 🌟 Features

### Core Functionality
- **Smart Matching Algorithm**: AI-powered matching system that analyzes 6 key lifestyle metrics
- **Comprehensive Neighborhood Database**: Detailed information on neighborhoods across major Indian cities
- **Personalized Recommendations**: Tailored suggestions based on user preferences and demographics
- **Advanced Filtering & Search**: Filter by budget, city, safety, and more with real-time search
- **Community Reviews**: Read and write authentic neighborhood reviews
- **Interactive Dashboard**: Visual representation of matches and preferences
- **Admin Portal**: Complete administrative interface for managing neighborhoods and users
- **User Management**: Admin capabilities to manage user accounts and permissions
- **Image Support**: Visual neighborhood representation with image uploads
- **Pagination**: Efficient browsing with paginated results

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
│   ├── public/             # Public assets
│   └── vercel.json         # Vercel deployment config
├── server/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts
│   ├── services/           # Business logic services
│   └── vercel.json         # Vercel deployment config
├── DEPLOYMENT.md           # Deployment guide
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

### 5. Create Admin User

Promote a user to admin status:
```bash
cd server
node scripts/promoteAdmin.js <user-email>
```

### 6. Start the Application

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

### User Management (Admin Only)
- `GET /api/auth/users` - Get all users
- `PUT /api/auth/users/:id/admin` - Update user admin status
- `DELETE /api/auth/users/:id` - Delete user

### User Preferences
- `GET /api/preferences` - Get user preferences
- `POST /api/preferences` - Create/update preferences
- `DELETE /api/preferences` - Delete preferences
- `GET /api/preferences/status` - Get completion status

### Neighborhoods
- `GET /api/neighborhoods` - Get all neighborhoods (with filtering & pagination)
- `GET /api/neighborhoods/:id` - Get neighborhood by ID
- `GET /api/neighborhoods/cities` - Get available cities
- `GET /api/neighborhoods/search` - Search neighborhoods
- `GET /api/neighborhoods/matches` - Get personalized matches (protected)
- `GET /api/neighborhoods/:id/match-details` - Get detailed match analysis (protected)
- `POST /api/neighborhoods/:id/reviews` - Add neighborhood review (protected)

### Admin Neighborhood Management
- `POST /api/neighborhoods` - Create neighborhood (admin only)
- `PUT /api/neighborhoods/:id` - Update neighborhood (admin only)
- `DELETE /api/neighborhoods/:id` - Delete neighborhood (admin only)

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
- **Minimal Design**: Clean, easy-to-use interface for preferences

### Key Components
- **Interactive Sliders**: For setting lifestyle preferences
- **Match Cards**: Visual representation of neighborhood matches
- **Metric Bars**: Progress bars showing compatibility scores
- **Filter System**: Advanced filtering with real-time updates
- **Pagination Controls**: Efficient browsing of large datasets
- **Image Display**: Visual neighborhood representation

## 📱 Pages & Features

### Public Pages
- **Home**: Landing page with features and call-to-action
- **Neighborhoods**: Browse all neighborhoods with search and pagination
- **Neighborhood Detail**: Comprehensive neighborhood information with images

### Protected Pages
- **Dashboard**: Personalized overview with top matches
- **Preferences**: Set and update lifestyle preferences with minimal UI
- **Matches**: View all personalized neighborhood matches
- **Profile**: User account management

### Admin Pages
- **Admin Portal**: Complete administrative interface
  - **Neighborhood Management**: Create, edit, delete neighborhoods
  - **User Management**: Manage user accounts and admin permissions
  - **Image Management**: Upload and manage neighborhood images

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Client and server-side route protection
- **Admin Authorization**: Role-based access control for admin features
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Proper cross-origin request handling

## 🚀 Deployment

### Vercel Deployment

The project is configured for easy deployment to Vercel. See `DEPLOYMENT.md` for detailed instructions.

### Quick Deployment Steps

1. **Backend Deployment**:
   ```bash
   # Deploy to Vercel
   vercel --prod
   ```

2. **Frontend Deployment**:
   ```bash
   cd client
   vercel --prod
   ```

3. **Environment Variables**:
   - Set `MONGODB_URI` in Vercel dashboard
   - Set `JWT_SECRET` in Vercel dashboard
   - Set `VITE_API_URL` in client environment

### Build Commands
```bash
# Build client for production
cd client && npm run build

# Start server in production
cd server && NODE_ENV=production npm start
```

## 🗄️ Database Migration

### MongoDB Atlas Setup

To migrate from local MongoDB to MongoDB Atlas:

1. **Create Atlas Account**: Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Cluster**: Choose free tier (M0 Sandbox)
3. **Configure Access**: Set up database user and network access
4. **Export Data**: Export from local MongoDB using Compass or mongoexport
5. **Import Data**: Import to Atlas using Compass or mongoimport
6. **Update Connection**: Replace local URI with Atlas connection string

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/neighborfit?retryWrites=true&w=majority
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
- **Image Upload**: Direct image upload functionality for neighborhoods
- **Advanced Search**: Elasticsearch integration for better search

### Technical Improvements
- **Caching**: Redis for improved performance
- **Search**: Elasticsearch for advanced search capabilities
- **Testing**: Comprehensive unit and integration tests
- **Monitoring**: Application performance monitoring
- **CI/CD**: Automated deployment pipeline
- **Image Optimization**: Automatic image compression and optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Project Type**: Full-Stack MERN Application
- **Purpose**: Neighborhood-Lifestyle Matching Platform

## 📞 Support

For support, email [Anjalis6322@gmail.com] or create an issue in the repository.

---

**NeighborFit** - Find Your Perfect Neighborhood Match! 🏠✨