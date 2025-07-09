#!/bin/bash

# NeighborFit Development Setup Script
echo "🏠 Setting up NeighborFit Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 18
        NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR_VERSION" -lt 18 ]; then
            print_warning "Node.js version should be 18 or higher. Current: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if MongoDB is running
check_mongodb() {
    if command -v mongod &> /dev/null; then
        print_success "MongoDB is installed"
    else
        print_warning "MongoDB is not installed locally. You can use MongoDB Atlas instead."
        print_status "Visit https://www.mongodb.com/atlas to set up a cloud database"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing root dependencies..."
    npm install

    print_status "Installing client dependencies..."
    cd client && npm install
    cd ..

    print_status "Installing server dependencies..."
    cd server && npm install
    cd ..

    print_success "All dependencies installed successfully!"
}

# Setup environment files
setup_env() {
    print_status "Setting up environment files..."

    # Server .env
    if [ ! -f "server/.env" ]; then
        print_status "Creating server/.env file..."
        cat > server/.env << EOL
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/neighborfit

# JWT Secret (Change this in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
NODE_ENV=development
PORT=8000
EOL
        print_success "Created server/.env file"
        print_warning "Please update MONGODB_URI and JWT_SECRET in server/.env"
    else
        print_status "server/.env already exists"
    fi

    # Client .env
    if [ ! -f "client/.env" ]; then
        print_status "Creating client/.env file..."
        cat > client/.env << EOL
# API Configuration
VITE_API_URL=http://localhost:8000/api
EOL
        print_success "Created client/.env file"
    else
        print_status "client/.env already exists"
    fi
}

# Seed database
seed_database() {
    print_status "Seeding database with sample neighborhoods..."
    cd server
    
    # Check if MongoDB is accessible
    if npm run seed 2>/dev/null; then
        print_success "Database seeded successfully!"
    else
        print_warning "Could not seed database. Make sure MongoDB is running and accessible."
        print_status "You can run 'npm run seed' from the server directory later."
    fi
    cd ..
}

# Create startup scripts
create_scripts() {
    print_status "Creating development scripts..."

    # Create start-dev.sh
    cat > start-dev.sh << 'EOL'
#!/bin/bash

# Start NeighborFit in development mode
echo "🚀 Starting NeighborFit Development Servers..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start server in background
echo "📡 Starting backend server..."
cd server && npm run dev &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client in background
echo "🌐 Starting frontend client..."
cd client && npm run dev &
CLIENT_PID=$!

echo "✅ Both servers are starting..."
echo "📡 Backend: http://localhost:8000"
echo "🌐 Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait
EOL

    chmod +x start-dev.sh
    print_success "Created start-dev.sh script"

    # Create package.json scripts info
    print_status "Available npm scripts:"
    echo "  - npm run dev:client  # Start frontend only"
    echo "  - npm run dev:server  # Start backend only"
    echo "  - ./start-dev.sh      # Start both servers"
}

# Main setup function
main() {
    echo "🏠 NeighborFit Development Setup"
    echo "================================"
    
    check_node
    check_mongodb
    install_dependencies
    setup_env
    seed_database
    create_scripts
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "Next steps:"
    echo "1. Update server/.env with your MongoDB URI and JWT secret"
    echo "2. Start development servers:"
    echo "   ./start-dev.sh"
    echo ""
    echo "Or start individually:"
    echo "   npm run dev:server  # Terminal 1"
    echo "   npm run dev:client  # Terminal 2"
    echo ""
    echo "🌐 Frontend will be available at: http://localhost:5173"
    echo "📡 Backend API will be available at: http://localhost:8000"
    echo ""
    echo "📚 Check README.md for detailed documentation"
    echo ""
    print_success "Happy coding! 🚀"
}

# Run main function
main