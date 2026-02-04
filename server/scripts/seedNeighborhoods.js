import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Neighborhood from '../models/neighborhoodModel.js';

dotenv.config();

const sampleNeighborhoods = [
  {
    name: "Connaught Place",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 6,
      affordability: 5,
      cleanliness: 5,
      walkability: 9,
      nightlife: 9,
      transport: 10
    },
    demographics: {
      averageAge: 34,
      populationDensity: 32000,
      averageIncome: 90000
    },
    amenities: {
      schools: 8,
      hospitals: 12,
      parks: 4,
      restaurants: 260,
      shoppingCenters: 52,
      gyms: 18
    },
    coordinates: {
      latitude: 28.6315,
      longitude: 77.2167
    },
    housing: {
      averageRent1BHK: 42000,
      averageRent2BHK: 72000,
      averageRent3BHK: 105000,
      averagePropertyPrice: 20500000
    },
    nearbyTransportHubs: [
      { name: "Rajiv Chowk Metro Station", type: "metro", distance: 0.2 },
      { name: "New Delhi Railway Station", type: "railway", distance: 3 }
    ],
    overallRating: 4.0
  },
  {
    name: "Hauz Khas",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 5,
      cleanliness: 7,
      walkability: 9,
      nightlife: 10,
      transport: 8
    },
    demographics: {
      averageAge: 29,
      populationDensity: 19000,
      averageIncome: 110000
    },
    amenities: {
      schools: 10,
      hospitals: 7,
      parks: 9,
      restaurants: 190,
      shoppingCenters: 22,
      gyms: 20
    },
    coordinates: {
      latitude: 28.545,
      longitude: 77.1967
    },
    housing: {
      averageRent1BHK: 35000,
      averageRent2BHK: 60000,
      averageRent3BHK: 90000,
      averagePropertyPrice: 14000000
    },
    nearbyTransportHubs: [
      { name: "Hauz Khas Metro Station", type: "metro", distance: 0.6 },
      { name: "IIT Delhi Bus Stop", type: "bus", distance: 1.2 }
    ],
    overallRating: 4.4
  },
  {
    name: "Greater Kailash II",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 4,
      cleanliness: 8,
      walkability: 8,
      nightlife: 8,
      transport: 7
    },
    demographics: {
      averageAge: 36,
      populationDensity: 15000,
      averageIncome: 130000
    },
    amenities: {
      schools: 14,
      hospitals: 9,
      parks: 6,
      restaurants: 160,
      shoppingCenters: 18,
      gyms: 16
    },
    coordinates: {
      latitude: 28.535,
      longitude: 77.241
    },
    housing: {
      averageRent1BHK: 38000,
      averageRent2BHK: 68000,
      averageRent3BHK: 100000,
      averagePropertyPrice: 18000000
    },
    nearbyTransportHubs: [
      { name: "Greater Kailash Metro", type: "metro", distance: 1.1 },
      { name: "Nehru Place Bus Terminal", type: "bus", distance: 2 }
    ],
    overallRating: 4.3
  },
  {
    name: "Saket",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5f36?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 6,
      cleanliness: 7,
      walkability: 8,
      nightlife: 7,
      transport: 8
    },
    demographics: {
      averageAge: 33,
      populationDensity: 21000,
      averageIncome: 95000
    },
    amenities: {
      schools: 11,
      hospitals: 10,
      parks: 7,
      restaurants: 140,
      shoppingCenters: 28,
      gyms: 18
    },
    coordinates: {
      latitude: 28.5245,
      longitude: 77.2066
    },
    housing: {
      averageRent1BHK: 28000,
      averageRent2BHK: 50000,
      averageRent3BHK: 76000,
      averagePropertyPrice: 11000000
    },
    nearbyTransportHubs: [
      { name: "Saket Metro Station", type: "metro", distance: 0.4 },
      { name: "Malviya Nagar Bus Depot", type: "bus", distance: 1.2 }
    ],
    overallRating: 4.1
  },
  {
    name: "Dwarka Sector 6",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1470123808288-1e59739a2aae?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 7,
      cleanliness: 7,
      walkability: 6,
      nightlife: 5,
      transport: 8
    },
    demographics: {
      averageAge: 31,
      populationDensity: 24000,
      averageIncome: 75000
    },
    amenities: {
      schools: 16,
      hospitals: 7,
      parks: 10,
      restaurants: 90,
      shoppingCenters: 15,
      gyms: 14
    },
    coordinates: {
      latitude: 28.5921,
      longitude: 77.0495
    },
    housing: {
      averageRent1BHK: 22000,
      averageRent2BHK: 36000,
      averageRent3BHK: 52000,
      averagePropertyPrice: 8000000
    },
    nearbyTransportHubs: [
      { name: "Dwarka Sector 10 Metro", type: "metro", distance: 1.3 },
      { name: "IGI Airport T3", type: "airport", distance: 6.5 }
    ],
    overallRating: 3.9
  },
  {
    name: "Rohini Sector 13",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 6,
      affordability: 8,
      cleanliness: 6,
      walkability: 6,
      nightlife: 5,
      transport: 7
    },
    demographics: {
      averageAge: 32,
      populationDensity: 26000,
      averageIncome: 65000
    },
    amenities: {
      schools: 20,
      hospitals: 8,
      parks: 12,
      restaurants: 80,
      shoppingCenters: 12,
      gyms: 10
    },
    coordinates: {
      latitude: 28.7311,
      longitude: 77.1031
    },
    housing: {
      averageRent1BHK: 18000,
      averageRent2BHK: 28000,
      averageRent3BHK: 42000,
      averagePropertyPrice: 6500000
    },
    nearbyTransportHubs: [
      { name: "Rohini West Metro Station", type: "metro", distance: 1.5 },
      { name: "Madhuban Chowk Bus Stop", type: "bus", distance: 0.6 }
    ],
    overallRating: 3.7
  },
  {
    name: "Vasant Kunj",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 5,
      cleanliness: 8,
      walkability: 7,
      nightlife: 7,
      transport: 7
    },
    demographics: {
      averageAge: 35,
      populationDensity: 17000,
      averageIncome: 115000
    },
    amenities: {
      schools: 14,
      hospitals: 9,
      parks: 9,
      restaurants: 130,
      shoppingCenters: 26,
      gyms: 21
    },
    coordinates: {
      latitude: 28.5206,
      longitude: 77.155
    },
    housing: {
      averageRent1BHK: 32000,
      averageRent2BHK: 52000,
      averageRent3BHK: 78000,
      averagePropertyPrice: 12500000
    },
    nearbyTransportHubs: [
      { name: "Chhatarpur Metro Station", type: "metro", distance: 3 },
      { name: "IGI Airport T1", type: "airport", distance: 7.2 }
    ],
    overallRating: 4.2
  },
  {
    name: "Karol Bagh",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1469478714248-5eedd7b7b3cc?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 5,
      affordability: 7,
      cleanliness: 5,
      walkability: 8,
      nightlife: 6,
      transport: 9
    },
    demographics: {
      averageAge: 33,
      populationDensity: 33000,
      averageIncome: 70000
    },
    amenities: {
      schools: 9,
      hospitals: 11,
      parks: 3,
      restaurants: 200,
      shoppingCenters: 35,
      gyms: 12
    },
    coordinates: {
      latitude: 28.6513,
      longitude: 77.1891
    },
    housing: {
      averageRent1BHK: 26000,
      averageRent2BHK: 42000,
      averageRent3BHK: 60000,
      averagePropertyPrice: 9000000
    },
    nearbyTransportHubs: [
      { name: "Karol Bagh Metro Station", type: "metro", distance: 0.3 },
      { name: "New Delhi Railway Station", type: "railway", distance: 3.5 }
    ],
    overallRating: 3.8
  },
  {
    name: "Lajpat Nagar",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 6,
      affordability: 6,
      cleanliness: 6,
      walkability: 8,
      nightlife: 7,
      transport: 9
    },
    demographics: {
      averageAge: 31,
      populationDensity: 28000,
      averageIncome: 82000
    },
    amenities: {
      schools: 13,
      hospitals: 9,
      parks: 5,
      restaurants: 170,
      shoppingCenters: 30,
      gyms: 19
    },
    coordinates: {
      latitude: 28.5678,
      longitude: 77.243
    },
    housing: {
      averageRent1BHK: 30000,
      averageRent2BHK: 52000,
      averageRent3BHK: 78000,
      averagePropertyPrice: 11500000
    },
    nearbyTransportHubs: [
      { name: "Lajpat Nagar Metro Station", type: "metro", distance: 0.4 },
      { name: "Ring Road Bus Corridor", type: "bus", distance: 0.2 }
    ],
    overallRating: 4.0
  },
  {
    name: "Mayur Vihar Phase I",
    city: "Delhi",
    state: "Delhi",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 7,
      cleanliness: 7,
      walkability: 7,
      nightlife: 5,
      transport: 8
    },
    demographics: {
      averageAge: 32,
      populationDensity: 21000,
      averageIncome: 78000
    },
    amenities: {
      schools: 18,
      hospitals: 8,
      parks: 12,
      restaurants: 110,
      shoppingCenters: 17,
      gyms: 13
    },
    coordinates: {
      latitude: 28.6021,
      longitude: 77.3027
    },
    housing: {
      averageRent1BHK: 24000,
      averageRent2BHK: 38000,
      averageRent3BHK: 54000,
      averagePropertyPrice: 8200000
    },
    nearbyTransportHubs: [
      { name: "Mayur Vihar Phase 1 Metro", type: "metro", distance: 0.5 },
      { name: "Noida Link Road", type: "bus", distance: 1.1 }
    ],
    overallRating: 3.9
  },
  {
    name: "DLF Phase 1",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 5,
      cleanliness: 8,
      walkability: 7,
      nightlife: 8,
      transport: 8
    },
    demographics: {
      averageAge: 31,
      populationDensity: 16000,
      averageIncome: 120000
    },
    amenities: {
      schools: 9,
      hospitals: 7,
      parks: 11,
      restaurants: 150,
      shoppingCenters: 24,
      gyms: 18
    },
    coordinates: {
      latitude: 28.4699,
      longitude: 77.0869
    },
    housing: {
      averageRent1BHK: 32000,
      averageRent2BHK: 52000,
      averageRent3BHK: 78000,
      averagePropertyPrice: 12500000
    },
    nearbyTransportHubs: [
      { name: "Sikanderpur Metro Station", type: "metro", distance: 1.2 },
      { name: "MG Road", type: "bus", distance: 1.5 }
    ],
    overallRating: 4.2
  },
  {
    name: "DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5f36?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 5,
      cleanliness: 8,
      walkability: 8,
      nightlife: 9,
      transport: 9
    },
    demographics: {
      averageAge: 30,
      populationDensity: 17000,
      averageIncome: 130000
    },
    amenities: {
      schools: 7,
      hospitals: 6,
      parks: 9,
      restaurants: 200,
      shoppingCenters: 30,
      gyms: 22
    },
    coordinates: {
      latitude: 28.4825,
      longitude: 77.088
    },
    housing: {
      averageRent1BHK: 35000,
      averageRent2BHK: 58000,
      averageRent3BHK: 86000,
      averagePropertyPrice: 13500000
    },
    nearbyTransportHubs: [
      { name: "MG Road Metro Station", type: "metro", distance: 0.9 },
      { name: "Cyber City Rapid Metro", type: "metro", distance: 1.1 }
    ],
    overallRating: 4.3
  },
  {
    name: "DLF Cyber City",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1470123808288-1e59739a2aae?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 9,
      affordability: 4,
      cleanliness: 9,
      walkability: 7,
      nightlife: 9,
      transport: 9
    },
    demographics: {
      averageAge: 29,
      populationDensity: 14000,
      averageIncome: 150000
    },
    amenities: {
      schools: 6,
      hospitals: 8,
      parks: 5,
      restaurants: 220,
      shoppingCenters: 34,
      gyms: 24
    },
    coordinates: {
      latitude: 28.4955,
      longitude: 77.0886
    },
    housing: {
      averageRent1BHK: 42000,
      averageRent2BHK: 65000,
      averageRent3BHK: 98000,
      averagePropertyPrice: 15000000
    },
    nearbyTransportHubs: [
      { name: "Cyber City Rapid Metro", type: "metro", distance: 0.1 },
      { name: "NH-48 Toll Plaza", type: "bus", distance: 1.8 }
    ],
    overallRating: 4.5
  },
  {
    name: "Sushant Lok Phase 1",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 6,
      cleanliness: 8,
      walkability: 7,
      nightlife: 7,
      transport: 8
    },
    demographics: {
      averageAge: 32,
      populationDensity: 15000,
      averageIncome: 100000
    },
    amenities: {
      schools: 12,
      hospitals: 9,
      parks: 10,
      restaurants: 130,
      shoppingCenters: 18,
      gyms: 16
    },
    coordinates: {
      latitude: 28.4593,
      longitude: 77.0721
    },
    housing: {
      averageRent1BHK: 26000,
      averageRent2BHK: 42000,
      averageRent3BHK: 60000,
      averagePropertyPrice: 9500000
    },
    nearbyTransportHubs: [
      { name: "Huda City Centre", type: "metro", distance: 1.5 },
      { name: "Galleria Market", type: "bus", distance: 0.8 }
    ],
    overallRating: 4.1
  },
  {
    name: "Sushant Lok Phase 2",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 6,
      cleanliness: 8,
      walkability: 6,
      nightlife: 6,
      transport: 7
    },
    demographics: {
      averageAge: 34,
      populationDensity: 14000,
      averageIncome: 90000
    },
    amenities: {
      schools: 10,
      hospitals: 6,
      parks: 11,
      restaurants: 90,
      shoppingCenters: 12,
      gyms: 12
    },
    coordinates: {
      latitude: 28.4443,
      longitude: 77.0935
    },
    housing: {
      averageRent1BHK: 23000,
      averageRent2BHK: 36000,
      averageRent3BHK: 52000,
      averagePropertyPrice: 8200000
    },
    nearbyTransportHubs: [
      { name: "Sector 55-56 Rapid Metro", type: "metro", distance: 1.9 },
      { name: "Golf Course Road", type: "bus", distance: 1 }
    ],
    overallRating: 3.9
  },
  {
    name: "Nirvana Country",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1469478714248-5eedd7b7b3cc?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 5,
      cleanliness: 9,
      walkability: 7,
      nightlife: 5,
      transport: 6
    },
    demographics: {
      averageAge: 35,
      populationDensity: 9000,
      averageIncome: 125000
    },
    amenities: {
      schools: 5,
      hospitals: 4,
      parks: 18,
      restaurants: 70,
      shoppingCenters: 8,
      gyms: 10
    },
    coordinates: {
      latitude: 28.4036,
      longitude: 77.071
    },
    housing: {
      averageRent1BHK: 30000,
      averageRent2BHK: 52000,
      averageRent3BHK: 78000,
      averagePropertyPrice: 13500000
    },
    nearbyTransportHubs: [
      { name: "Golf Course Extension Road", type: "bus", distance: 1.5 },
      { name: "Huda City Centre Metro", type: "metro", distance: 6 }
    ],
    overallRating: 4.2
  },
  {
    name: "South City 1",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 6,
      cleanliness: 7,
      walkability: 7,
      nightlife: 6,
      transport: 8
    },
    demographics: {
      averageAge: 33,
      populationDensity: 18000,
      averageIncome: 100000
    },
    amenities: {
      schools: 11,
      hospitals: 7,
      parks: 9,
      restaurants: 110,
      shoppingCenters: 14,
      gyms: 13
    },
    coordinates: {
      latitude: 28.4503,
      longitude: 77.0398
    },
    housing: {
      averageRent1BHK: 24000,
      averageRent2BHK: 42000,
      averageRent3BHK: 62000,
      averagePropertyPrice: 9000000
    },
    nearbyTransportHubs: [
      { name: "Huda City Centre Metro", type: "metro", distance: 1 },
      { name: "NH-48", type: "bus", distance: 2 }
    ],
    overallRating: 4.0
  },
  {
    name: "South City 2",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 6,
      cleanliness: 7,
      walkability: 6,
      nightlife: 5,
      transport: 6
    },
    demographics: {
      averageAge: 34,
      populationDensity: 15000,
      averageIncome: 90000
    },
    amenities: {
      schools: 9,
      hospitals: 5,
      parks: 12,
      restaurants: 85,
      shoppingCenters: 10,
      gyms: 11
    },
    coordinates: {
      latitude: 28.426,
      longitude: 77.053
    },
    housing: {
      averageRent1BHK: 22000,
      averageRent2BHK: 36000,
      averageRent3BHK: 52000,
      averagePropertyPrice: 7800000
    },
    nearbyTransportHubs: [
      { name: "SPR Road", type: "bus", distance: 1.5 },
      { name: "Sector 55-56 Metro", type: "metro", distance: 4 }
    ],
    overallRating: 3.8
  },
  {
    name: "Golf Course Road",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 9,
      affordability: 4,
      cleanliness: 9,
      walkability: 8,
      nightlife: 8,
      transport: 9
    },
    demographics: {
      averageAge: 32,
      populationDensity: 13000,
      averageIncome: 150000
    },
    amenities: {
      schools: 8,
      hospitals: 6,
      parks: 7,
      restaurants: 170,
      shoppingCenters: 20,
      gyms: 18
    },
    coordinates: {
      latitude: 28.4435,
      longitude: 77.103
    },
    housing: {
      averageRent1BHK: 42000,
      averageRent2BHK: 70000,
      averageRent3BHK: 110000,
      averagePropertyPrice: 18000000
    },
    nearbyTransportHubs: [
      { name: "Golf Course Road Rapid Metro", type: "metro", distance: 0.5 },
      { name: "Golf Course Extension Road", type: "bus", distance: 1 }
    ],
    overallRating: 4.4
  },
  {
    name: "Sector 57",
    city: "Gurugram",
    state: "Haryana",
    imageUrl: "https://images.unsplash.com/photo-1470123808288-1e59739a2aae?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 6,
      cleanliness: 7,
      walkability: 6,
      nightlife: 5,
      transport: 6
    },
    demographics: {
      averageAge: 31,
      populationDensity: 16000,
      averageIncome: 85000
    },
    amenities: {
      schools: 10,
      hospitals: 6,
      parks: 8,
      restaurants: 80,
      shoppingCenters: 9,
      gyms: 10
    },
    coordinates: {
      latitude: 28.4269,
      longitude: 77.0911
    },
    housing: {
      averageRent1BHK: 21000,
      averageRent2BHK: 34000,
      averageRent3BHK: 50000,
      averagePropertyPrice: 7200000
    },
    nearbyTransportHubs: [
      { name: "Sector 55-56 Metro", type: "metro", distance: 2.5 },
      { name: "Golf Course Extension Road", type: "bus", distance: 1.3 }
    ],
    overallRating: 3.7
  },
  {
    name: "Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 6,
      cleanliness: 7,
      walkability: 8,
      nightlife: 9,
      transport: 8
    },
    demographics: {
      averageAge: 27,
      populationDensity: 15500,
      averageIncome: 90000
    },
    amenities: {
      schools: 12,
      hospitals: 8,
      parks: 6,
      restaurants: 180,
      shoppingCenters: 24,
      gyms: 22
    },
    coordinates: {
      latitude: 12.9352,
      longitude: 77.6245
    },
    housing: {
      averageRent1BHK: 26000,
      averageRent2BHK: 41000,
      averageRent3BHK: 61000,
      averagePropertyPrice: 8800000
    },
    nearbyTransportHubs: [
      { name: "Forum Junction", type: "bus", distance: 0.4 },
      { name: "Silk Board Junction", type: "bus", distance: 2 }
    ],
    overallRating: 4.3
  },
  {
    name: "Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 5,
      cleanliness: 8,
      walkability: 9,
      nightlife: 10,
      transport: 8
    },
    demographics: {
      averageAge: 30,
      populationDensity: 18500,
      averageIncome: 105000
    },
    amenities: {
      schools: 8,
      hospitals: 6,
      parks: 8,
      restaurants: 210,
      shoppingCenters: 28,
      gyms: 25
    },
    coordinates: {
      latitude: 12.9784,
      longitude: 77.6408
    },
    housing: {
      averageRent1BHK: 32000,
      averageRent2BHK: 52000,
      averageRent3BHK: 78000,
      averagePropertyPrice: 12000000
    },
    nearbyTransportHubs: [
      { name: "Indiranagar Metro Station", type: "metro", distance: 0.3 },
      { name: "Old Airport Road", type: "bus", distance: 0.8 }
    ],
    overallRating: 4.5
  },
  {
    name: "Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 7,
      cleanliness: 8,
      walkability: 6,
      nightlife: 6,
      transport: 6
    },
    demographics: {
      averageAge: 32,
      populationDensity: 12500,
      averageIncome: 120000
    },
    amenities: {
      schools: 15,
      hospitals: 12,
      parks: 12,
      restaurants: 110,
      shoppingCenters: 18,
      gyms: 18
    },
    coordinates: {
      latitude: 12.9698,
      longitude: 77.75
    },
    housing: {
      averageRent1BHK: 21000,
      averageRent2BHK: 36000,
      averageRent3BHK: 52000,
      averagePropertyPrice: 7200000
    },
    nearbyTransportHubs: [
      { name: "Whitefield Railway Station", type: "railway", distance: 1 },
      { name: "ITPL Bus Stop", type: "bus", distance: 0.6 }
    ],
    overallRating: 4.1
  },
  {
    name: "HSR Layout",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5f36?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 7,
      cleanliness: 7,
      walkability: 8,
      nightlife: 7,
      transport: 7
    },
    demographics: {
      averageAge: 29,
      populationDensity: 15000,
      averageIncome: 90000
    },
    amenities: {
      schools: 10,
      hospitals: 7,
      parks: 10,
      restaurants: 140,
      shoppingCenters: 16,
      gyms: 19
    },
    coordinates: {
      latitude: 12.9121,
      longitude: 77.6446
    },
    housing: {
      averageRent1BHK: 22000,
      averageRent2BHK: 36000,
      averageRent3BHK: 52000,
      averagePropertyPrice: 7800000
    },
    nearbyTransportHubs: [
      { name: "Agara Lake", type: "bus", distance: 1.2 },
      { name: "Silk Board", type: "bus", distance: 2.5 }
    ],
    overallRating: 4.0
  },
  {
    name: "Jayanagar",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1470123808288-1e59739a2aae?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 6,
      cleanliness: 8,
      walkability: 9,
      nightlife: 6,
      transport: 8
    },
    demographics: {
      averageAge: 35,
      populationDensity: 14000,
      averageIncome: 85000
    },
    amenities: {
      schools: 14,
      hospitals: 10,
      parks: 11,
      restaurants: 120,
      shoppingCenters: 14,
      gyms: 15
    },
    coordinates: {
      latitude: 12.925,
      longitude: 77.5938
    },
    housing: {
      averageRent1BHK: 24000,
      averageRent2BHK: 38000,
      averageRent3BHK: 56000,
      averagePropertyPrice: 8800000
    },
    nearbyTransportHubs: [
      { name: "Jayanagar Metro Station", type: "metro", distance: 0.4 },
      { name: "Rashtriya Vidyalaya Road", type: "bus", distance: 0.7 }
    ],
    overallRating: 4.2
  },
  {
    name: "Malleshwaram",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 6,
      cleanliness: 8,
      walkability: 7,
      nightlife: 5,
      transport: 8
    },
    demographics: {
      averageAge: 37,
      populationDensity: 14500,
      averageIncome: 82000
    },
    amenities: {
      schools: 16,
      hospitals: 11,
      parks: 9,
      restaurants: 110,
      shoppingCenters: 13,
      gyms: 12
    },
    coordinates: {
      latitude: 13.0007,
      longitude: 77.569
    },
    housing: {
      averageRent1BHK: 23000,
      averageRent2BHK: 36000,
      averageRent3BHK: 52000,
      averagePropertyPrice: 8200000
    },
    nearbyTransportHubs: [
      { name: "Sampige Road Metro", type: "metro", distance: 0.8 },
      { name: "Malleshwaram Railway Station", type: "railway", distance: 1.2 }
    ],
    overallRating: 4.1
  },
  {
    name: "Hebbal",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1486304873000-235643847519?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 7,
      cleanliness: 7,
      walkability: 6,
      nightlife: 5,
      transport: 8
    },
    demographics: {
      averageAge: 31,
      populationDensity: 16000,
      averageIncome: 78000
    },
    amenities: {
      schools: 13,
      hospitals: 9,
      parks: 10,
      restaurants: 90,
      shoppingCenters: 12,
      gyms: 11
    },
    coordinates: {
      latitude: 13.0358,
      longitude: 77.597
    },
    housing: {
      averageRent1BHK: 20000,
      averageRent2BHK: 32000,
      averageRent3BHK: 48000,
      averagePropertyPrice: 7200000
    },
    nearbyTransportHubs: [
      { name: "Hebbal Flyover", type: "bus", distance: 0.5 },
      { name: "Kempegowda International Airport", type: "airport", distance: 28 }
    ],
    overallRating: 3.9
  },
  {
    name: "Yelahanka",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 8,
      affordability: 7,
      cleanliness: 8,
      walkability: 6,
      nightlife: 4,
      transport: 6
    },
    demographics: {
      averageAge: 33,
      populationDensity: 10000,
      averageIncome: 70000
    },
    amenities: {
      schools: 11,
      hospitals: 6,
      parks: 13,
      restaurants: 70,
      shoppingCenters: 8,
      gyms: 9
    },
    coordinates: {
      latitude: 13.1007,
      longitude: 77.5963
    },
    housing: {
      averageRent1BHK: 17000,
      averageRent2BHK: 28000,
      averageRent3BHK: 42000,
      averagePropertyPrice: 6000000
    },
    nearbyTransportHubs: [
      { name: "Yelahanka Railway Station", type: "railway", distance: 1 },
      { name: "Airport Expressway", type: "bus", distance: 3 }
    ],
    overallRating: 3.8
  },
  {
    name: "Electronic City",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1505764706515-aa95265c5f36?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 7,
      affordability: 8,
      cleanliness: 7,
      walkability: 5,
      nightlife: 5,
      transport: 6
    },
    demographics: {
      averageAge: 28,
      populationDensity: 18000,
      averageIncome: 90000
    },
    amenities: {
      schools: 9,
      hospitals: 6,
      parks: 7,
      restaurants: 120,
      shoppingCenters: 14,
      gyms: 14
    },
    coordinates: {
      latitude: 12.839,
      longitude: 77.677
    },
    housing: {
      averageRent1BHK: 16000,
      averageRent2BHK: 26000,
      averageRent3BHK: 38000,
      averagePropertyPrice: 5200000
    },
    nearbyTransportHubs: [
      { name: "Electronic City Bus Stand", type: "bus", distance: 0.5 },
      { name: "Upcoming Metro Depot", type: "metro", distance: 2 }
    ],
    overallRating: 3.7
  },
  {
    name: "Sadashivanagar",
    city: "Bangalore",
    state: "Karnataka",
    imageUrl: "https://images.unsplash.com/photo-1470123808288-1e59739a2aae?auto=format&fit=crop&w=1200&q=80",
    metrics: {
      safety: 9,
      affordability: 4,
      cleanliness: 9,
      walkability: 7,
      nightlife: 5,
      transport: 7
    },
    demographics: {
      averageAge: 38,
      populationDensity: 9000,
      averageIncome: 140000
    },
    amenities: {
      schools: 7,
      hospitals: 5,
      parks: 10,
      restaurants: 80,
      shoppingCenters: 10,
      gyms: 9
    },
    coordinates: {
      latitude: 13.0098,
      longitude: 77.5752
    },
    housing: {
      averageRent1BHK: 40000,
      averageRent2BHK: 65000,
      averageRent3BHK: 95000,
      averagePropertyPrice: 16000000
    },
    nearbyTransportHubs: [
      { name: "Mekhri Circle", type: "bus", distance: 1.5 },
      { name: "Sadananda Nagar Metro (planned)", type: "metro", distance: 3 }
    ],
    overallRating: 4.4
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
