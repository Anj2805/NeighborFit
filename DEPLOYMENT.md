# Deployment Guide for NeighborFit

## Prerequisites

1. **MongoDB Database**: Set up a MongoDB database (MongoDB Atlas recommended)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Deploy Backend (Server)

### 1.1 Prepare Backend
```bash
cd server
```

### 1.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following configuration:
   - **Framework Preset**: Node.js
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Output Directory**: (leave empty)
   - **Install Command**: `npm install`

### 1.3 Environment Variables
Add these environment variables in Vercel dashboard:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

### 1.4 Deploy
Click "Deploy" and wait for the build to complete.

### 1.5 Get Backend URL
Copy the deployment URL (e.g., `https://your-app-name.vercel.app`)

## Step 2: Deploy Frontend (Client)

### 2.1 Update API URL
1. Go to your GitHub repository
2. Edit `client/.env` or create `client/.env.production`:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### 2.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository again
4. Set the following configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2.3 Deploy
Click "Deploy" and wait for the build to complete.

## Step 3: Database Setup

### 3.1 Seed Database
1. Connect to your MongoDB database
2. Run the seed script:
```bash
cd server
npm run seed
```

### 3.2 Create Admin User
Use the script to promote a user to admin:
```bash
cd server
node scripts/promoteAdmin.js admin@example.com
```

## Step 4: Test Deployment

1. **Frontend**: Visit your frontend URL
2. **Backend**: Test API endpoints at `your-backend-url.vercel.app/api/neighborhoods`
3. **Admin Portal**: Login as admin and test admin features

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Ensure your backend CORS settings include your frontend domain
2. **Database Connection**: Check MongoDB connection string and network access
3. **Environment Variables**: Verify all environment variables are set in Vercel
4. **Build Errors**: Check build logs in Vercel dashboard

### Environment Variables Checklist:
- [ ] `MONGODB_URI` (Backend)
- [ ] `JWT_SECRET` (Backend)
- [ ] `NODE_ENV=production` (Backend)
- [ ] `VITE_API_URL` (Frontend)

## URLs Structure
- **Frontend**: `https://your-frontend-app.vercel.app`
- **Backend API**: `https://your-backend-app.vercel.app/api`
- **Admin Portal**: `https://your-frontend-app.vercel.app/admin`

## Security Notes
1. Use strong JWT secrets
2. Enable MongoDB network security
3. Set up proper CORS origins
4. Use environment variables for all secrets 