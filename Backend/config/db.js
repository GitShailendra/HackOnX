// config/db.js
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    // const mongoURI = process.env.MONGO_URL;
    const mongoURI = process.env.MONGO_URL;
        
        console.log('Attempting to connect to MongoDB...');
        // console.log('MongoDB URI defined:', !!mongoURI);
        
        if (!mongoURI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        await mongoose
        .connect(mongoURI, {
          
        })
        
    
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
