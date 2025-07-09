import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  lifestyle: {
    // Lifestyle preferences (1-10 scale, 10 being most important)
    safety: { type: Number, min: 1, max: 10, default: 5 },
    affordability: { type: Number, min: 1, max: 10, default: 5 },
    cleanliness: { type: Number, min: 1, max: 10, default: 5 },
    walkability: { type: Number, min: 1, max: 10, default: 5 },
    nightlife: { type: Number, min: 1, max: 10, default: 5 },
    transport: { type: Number, min: 1, max: 10, default: 5 }
  },
  demographics: {
    age: { type: Number, min: 18, max: 100 },
    occupation: { type: String },
    familyStatus: { 
      type: String, 
      enum: ['single', 'couple', 'family_with_kids', 'retired'],
      default: 'single'
    },
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100000 }
    }
  },
  location: {
    currentCity: { type: String },
    preferredCities: [{ type: String }],
    maxCommuteTime: { type: Number, default: 30 } // in minutes
  }
}, { 
  timestamps: true 
});

export default mongoose.model('UserPreferences', userPreferencesSchema);