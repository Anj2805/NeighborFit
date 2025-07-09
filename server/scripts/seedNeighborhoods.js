import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Neighborhood from '../models/neighborhoodModel.js';

dotenv.config();

const sampleNeighborhoods = [
  {
    name: "Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    metrics: {
      safety: 8,
      affordability: 6,
      cleanliness: 7,
      walkability: 8,
      nightlife: 9,
      transport: 8
    },
    demographics: {
      averageAge: 28,
      populationDensity: 15000,
      averageIncome: 80000
    },
    amenities: {
      schools: 12,
      hospitals: 8,
      parks: 5,
      restaurants: 150,
      shoppingCenters: 25,
      gyms: 20
    },
    coordinates: {
      latitude: 12.9352,
      longitude: 77.6245
    },
    housing: {
      averageRent1BHK: 25000,
      averageRent2BHK: 40000,
      averageRent3BHK: 60000,
      averagePropertyPrice: 8500000
    },
    nearbyTransportHubs: [
      { name: "Koramangala Metro Station", type: "metro", distance: 0.5 },
      { name: "Silk Board Junction", type: "bus", distance: 2 }
    ],
    overallRating: 4.2
  },
  {
    name: "Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    metrics: {
      safety: 8,
      affordability: 5,
      cleanliness: 7,
      walkability: 9,
      nightlife: 10,
      transport: 7
    },
    demographics: {
      averageAge: 30,
      populationDensity: 18000,
      averageIncome: 95000
    },
    amenities: {
      schools: 10,
      hospitals: 6,
      parks: 8,
      restaurants: 200,
      shoppingCenters: 30,
      gyms: 25
    },
    coordinates: {
      latitude: 12.9784,
      longitude: 77.6408
    },
    housing: {
      averageRent1BHK: 30000,
      averageRent2BHK: 50000,
      averageRent3BHK: 75000,
      averagePropertyPrice: 12000000
    },
    nearbyTransportHubs: [
      { name: "Indiranagar Metro Station", type: "metro", distance: 0.3 },
      { name: "HAL Airport", type: "airport", distance: 8 }
    ],
    overallRating: 4.5
  },
  {
    name: "Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    metrics: {
      safety: 9,
      affordability: 7,
      cleanliness: 8,
      walkability: 6,
      nightlife: 6,
      transport: 6
    },
    demographics: {
      averageAge: 32,
      populationDensity: 12000,
      averageIncome: 120000
    },
    amenities: {
      schools: 15,
      hospitals: 10,
      parks: 12,
      restaurants: 80,
      shoppingCenters: 15,
      gyms: 18
    },
    coordinates: {
      latitude: 12.9698,
      longitude: 77.7500
    },
    housing: {
      averageRent1BHK: 20000,
      averageRent2BHK: 35000,
      averageRent3BHK: 50000,
      averagePropertyPrice: 7000000
    },
    nearbyTransportHubs: [
      { name: "Whitefield Railway Station", type: "railway", distance: 1 },
      { name: "ITPL Bus Stop", type: "bus", distance: 0.5 }
    ],
    overallRating: 4.0
  },
  {
    name: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    metrics: {
      safety: 7,
      affordability: 4,
      cleanliness: 6,
      walkability: 8,
      nightlife: 10,
      transport: 9
    },
    demographics: {
      averageAge: 29,
      populationDensity: 25000,
      averageIncome: 150000
    },
    amenities: {
      schools: 20,
      hospitals: 15,
      parks: 6,
      restaurants: 300,
      shoppingCenters: 40,
      gyms: 35
    },
    coordinates: {
      latitude: 19.0596,
      longitude: 72.8295
    },
    housing: {
      averageRent1BHK: 45000,
      averageRent2BHK: 80000,
      averageRent3BHK: 120000,
      averagePropertyPrice: 25000000
    },
    nearbyTransportHubs: [
      { name: "Bandra Railway Station", type: "railway", distance: 0.8 },
      { name: "Bandra-Kurla Complex", type: "bus", distance: 2 }
    ],
    overallRating: 4.3
  },
  {
    name: "Powai",
    city: "Mumbai",
    state: "Maharashtra",
    metrics: {
      safety: 8,
      affordability: 6,
      cleanliness: 8,
      walkability: 7,
      nightlife: 7,
      transport: 7
    },
    demographics: {
      averageAge: 31,
      populationDensity: 20000,
      averageIncome: 110000
    },
    amenities: {
      schools: 18,
      hospitals: 12,
      parks: 10,
      restaurants: 120,
      shoppingCenters: 20,
      gyms: 25
    },
    coordinates: {
      latitude: 19.1176,
      longitude: 72.9060
    },
    housing: {
      averageRent1BHK: 35000,
      averageRent2BHK: 60000,
      averageRent3BHK: 90000,
      averagePropertyPrice: 15000000
    },
    nearbyTransportHubs: [
      { name: "Powai Bus Depot", type: "bus", distance: 0.5 },
      { name: "Andheri Railway Station", type: "railway", distance: 8 }
    ],
    overallRating: 4.1
  },
  {
    name: "Connaught Place",
    city: "Delhi",
    state: "Delhi",
    metrics: {
      safety: 6,
      affordability: 5,
      cleanliness: 5,
      walkability: 9,
      nightlife: 8,
      transport: 10
    },
    demographics: {
      averageAge: 35,
      populationDensity: 30000,
      averageIncome: 85000
    },
    amenities: {
      schools: 8,
      hospitals: 10,
      parks: 4,
      restaurants: 250,
      shoppingCenters: 50,
      gyms: 15
    },
    coordinates: {
      latitude: 28.6315,
      longitude: 77.2167
    },
    housing: {
      averageRent1BHK: 40000,
      averageRent2BHK: 70000,
      averageRent3BHK: 100000,
      averagePropertyPrice: 20000000
    },
    nearbyTransportHubs: [
      { name: "Rajiv Chowk Metro Station", type: "metro", distance: 0.2 },
      { name: "New Delhi Railway Station", type: "railway", distance: 3 }
    ],
    overallRating: 3.8
  },
  {
    name: "Gurgaon Sector 29",
    city: "Gurgaon",
    state: "Haryana",
    metrics: {
      safety: 7,
      affordability: 6,
      cleanliness: 7,
      walkability: 6,
      nightlife: 8,
      transport: 7
    },
    demographics: {
      averageAge: 28,
      populationDensity: 15000,
      averageIncome: 95000
    },
    amenities: {
      schools: 12,
      hospitals: 8,
      parks: 6,
      restaurants: 100,
      shoppingCenters: 25,
      gyms: 20
    },
    coordinates: {
      latitude: 28.4595,
      longitude: 77.0266
    },
    housing: {
      averageRent1BHK: 25000,
      averageRent2BHK: 45000,
      averageRent3BHK: 65000,
      averagePropertyPrice: 9000000
    },
    nearbyTransportHubs: [
      { name: "Huda City Centre Metro", type: "metro", distance: 2 },
      { name: "Leisure Valley Park", type: "bus", distance: 0.5 }
    ],
    overallRating: 4.0
  },
  {
    name: "Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    metrics: {
      safety: 8,
      affordability: 7,
      cleanliness: 7,
      walkability: 7,
      nightlife: 6,
      transport: 8
    },
    demographics: {
      averageAge: 33,
      populationDensity: 18000,
      averageIncome: 75000
    },
    amenities: {
      schools: 15,
      hospitals: 12,
      parks: 8,
      restaurants: 90,
      shoppingCenters: 18,
      gyms: 15
    },
    coordinates: {
      latitude: 13.0850,
      longitude: 80.2101
    },
    housing: {
      averageRent1BHK: 18000,
      averageRent2BHK: 30000,
      averageRent3BHK: 45000,
      averagePropertyPrice: 6500000
    },
    nearbyTransportHubs: [
      { name: "Anna Nagar Metro Station", type: "metro", distance: 0.5 },
      { name: "Chennai Central", type: "railway", distance: 8 }
    ],
    overallRating: 4.1
  }
];

const seedNeighborhoods = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing neighborhoods
    await Neighborhood.deleteMany({});
    console.log('Cleared existing neighborhoods');

    // Insert sample neighborhoods
    const insertedNeighborhoods = await Neighborhood.insertMany(sampleNeighborhoods);
    console.log(`✅ Successfully seeded ${insertedNeighborhoods.length} neighborhoods`);

    // Display summary
    const cities = [...new Set(sampleNeighborhoods.map(n => n.city))];
    console.log(`📍 Cities covered: ${cities.join(', ')}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding neighborhoods:', error);
    process.exit(1);
  }
};

// Run the seed function
seedNeighborhoods();