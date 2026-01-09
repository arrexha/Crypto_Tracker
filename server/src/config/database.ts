import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DB_CONNECTION || 'mongodb://localhost:27017/crypto-tracker';

export const connectDatabase = async () => {
  try {
    console.log('Connecting to MongoDB at:', MONGODB_URI.split('@')[0] + '@...');
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const db = mongoose.connection;
