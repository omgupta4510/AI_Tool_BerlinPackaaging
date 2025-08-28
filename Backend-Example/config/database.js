const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await createIndexes();
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    
    // Create text index for company search
    await db.collection('companies').createIndex({
      name: 'text',
      normalizedName: 'text',
      aliases: 'text',
      industry: 'text'
    });
    
    // Create compound index for efficient queries
    await db.collection('companies').createIndex({
      normalizedName: 1,
      createdAt: -1
    });
    
    // Create indexes for analysis collections
    await db.collection('productanalyses').createIndex({ companyId: 1, lastUpdated: -1 });
    await db.collection('competitiveanalyses').createIndex({ companyId: 1, lastUpdated: -1 });
    await db.collection('trendsanalyses').createIndex({ companyId: 1, lastUpdated: -1 });
    await db.collection('commercialstrategies').createIndex({ companyId: 1, lastUpdated: -1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};

module.exports = connectDB;
