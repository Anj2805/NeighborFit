import mongoose from 'mongoose';

const neighborhoodSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  imageUrl: { type: String },
  country: { type: String, default: 'India' },
  
  // Lifestyle metrics (1-10 scale)
  metrics: {
    safety: { type: Number, min: 1, max: 10, required: true },
    affordability: { type: Number, min: 1, max: 10, required: true },
    cleanliness: { type: Number, min: 1, max: 10, required: true },
    walkability: { type: Number, min: 1, max: 10, required: true },
    nightlife: { type: Number, min: 1, max: 10, required: true },
    transport: { type: Number, min: 1, max: 10, required: true }
  },
  
  // Additional neighborhood information
  demographics: {
    averageAge: { type: Number },
    populationDensity: { type: Number }, // per sq km
    averageIncome: { type: Number }
  },
  
  amenities: {
    schools: { type: Number, default: 0 },
    hospitals: { type: Number, default: 0 },
    parks: { type: Number, default: 0 },
    restaurants: { type: Number, default: 0 },
    shoppingCenters: { type: Number, default: 0 },
    gyms: { type: Number, default: 0 }
  },
  
  // Geographic data
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  
  // Housing data
  housing: {
    averageRent1BHK: { type: Number },
    averageRent2BHK: { type: Number },
    averageRent3BHK: { type: Number },
    averagePropertyPrice: { type: Number }
  },
  
  // Commute information
  nearbyTransportHubs: [{
    name: { type: String },
    type: { type: String, enum: ['metro', 'bus', 'railway', 'airport'] },
    distance: { type: Number } // in km
  }],
  
  // Reviews and ratings
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Overall rating calculated from reviews
  overallRating: { type: Number, min: 1, max: 5, default: 3 },
  
  // Data sources and last updated
  dataSource: { type: String, default: 'manual' },
  lastUpdated: { type: Date, default: Date.now }
}, { 
  timestamps: true 
});

// Index for efficient searching
neighborhoodSchema.index({ city: 1, state: 1 });
neighborhoodSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Calculate overall rating from reviews
neighborhoodSchema.methods.calculateOverallRating = function() {
  if (this.reviews.length === 0) return 3;
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.overallRating = sum / this.reviews.length;
  return this.overallRating;
};

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);
export default Neighborhood;
