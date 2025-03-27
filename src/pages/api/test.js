// api/test.js - MongoDB connection test
import connectDB from './utils/db';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    // Test database connection
    await connectDB();
    
    // Get connection status and database info
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      4: 'invalid credentials'
    };
    
    // Get database info
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    res.status(200).json({ 
      success: true, 
      message: 'MongoDB connection test',
      database: {
        connectionState: stateMap[connectionState] || 'unknown',
        name: dbName,
        host: host,
        collections: collectionNames
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB Test Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to connect to MongoDB',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}