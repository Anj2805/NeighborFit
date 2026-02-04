import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js';
import Neighborhood from '../models/neighborhoodModel.js';

dotenv.config();

const migrate = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Ensure all users have roles array and new fields
    const userUpdates = await User.updateMany(
      { roles: { $exists: false } },
      { $set: { roles: ['user'] } }
    );
    console.log(`Updated ${userUpdates.modifiedCount} users with default roles`);

    const adminRoleUpdates = await User.updateMany(
      { isAdmin: true },
      { $addToSet: { roles: 'admin' } }
    );
    console.log(`Synced roles for ${adminRoleUpdates.modifiedCount} legacy admins`);

    await User.updateMany(
      { lastActive: { $exists: false } },
      {
        $set: {
          lastActive: null,
          familyStatus: null,
          city: null,
          softDeleted: false,
          suspended: false
        }
      }
    );
    console.log('Ensured new user fields exist');

    // 2. Neighborhood fields
    const neighborhoodUpdates = await Neighborhood.updateMany(
      {
        $or: [
          { viewCount: { $exists: false } },
          { matchSuccessRate: { $exists: false } },
          { sentimentScore: { $exists: false } },
          { images: { $exists: false } }
        ]
      },
      {
        $set: {
          viewCount: 0,
          matchSuccessRate: 0,
          sentimentScore: 0,
          images: []
        }
      }
    );
    console.log(`Updated ${neighborhoodUpdates.modifiedCount} neighborhoods with analytics fields`);

    console.log('Phase 1 migration completed successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
