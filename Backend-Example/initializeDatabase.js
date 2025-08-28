const mongoose = require('mongoose');
const Company = require('./models/Company');
const { normalizeCompanyName, generateCompanyAliases } = require('./utils/companySearchUtils');

require('dotenv').config();

const sampleCompanies = [
  {
    name: 'Microsoft Corporation',
    industry: 'Technology',
    description: 'Multinational technology corporation developing computer software, consumer electronics, personal computers, and related services',
    website: 'https://www.microsoft.com'
  },
  {
    name: 'Apple Inc.',
    industry: 'Technology',
    description: 'American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services',
    website: 'https://www.apple.com'
  },
  {
    name: 'Procter & Gamble',
    industry: 'Consumer Goods',
    description: 'American multinational consumer goods corporation that manufactures health care, hygiene and personal care products',
    website: 'https://www.pg.com'
  },
  {
    name: 'Tesla Inc.',
    industry: 'Automotive',
    description: 'American electric vehicle and clean energy company',
    website: 'https://www.tesla.com'
  },
  {
    name: 'Amazon.com Inc.',
    industry: 'E-commerce',
    description: 'American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence',
    website: 'https://www.amazon.com'
  },
  {
    name: 'Alphabet Inc.',
    industry: 'Technology',
    description: 'American multinational conglomerate, parent company of Google',
    website: 'https://www.abc.xyz'
  },
  {
    name: 'Meta Platforms Inc.',
    industry: 'Technology',
    description: 'American multinational technology conglomerate holding company that owns Facebook, Instagram, and WhatsApp',
    website: 'https://www.meta.com'
  },
  {
    name: 'The Coca-Cola Company',
    industry: 'Beverages',
    description: 'American multinational beverage corporation and manufacturer, retailer, and marketer of nonalcoholic beverage concentrates and syrups',
    website: 'https://www.coca-colacompany.com'
  },
  {
    name: 'Unilever PLC',
    industry: 'Consumer Goods',
    description: 'British-Dutch multinational consumer goods company with products including food, beverages, cleaning agents, and personal care products',
    website: 'https://www.unilever.com'
  },
  {
    name: 'Johnson & Johnson',
    industry: 'Healthcare',
    description: 'American multinational corporation that develops medical devices, pharmaceuticals, and consumer packaged goods',
    website: 'https://www.jnj.com'
  }
];

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing companies (optional)
    console.log('Clearing existing companies...');
    await Company.deleteMany({});

    // Insert sample companies
    console.log('Inserting sample companies...');
    for (const companyData of sampleCompanies) {
      const normalizedName = normalizeCompanyName(companyData.name);
      const aliases = generateCompanyAliases(companyData.name);

      const company = new Company({
        ...companyData,
        normalizedName,
        aliases,
        searchCount: Math.floor(Math.random() * 50) + 1 // Random search count for demo
      });

      await company.save();
      console.log(`Created company: ${companyData.name}`);
    }

    console.log(`Successfully initialized database with ${sampleCompanies.length} companies`);

    // Create indexes
    console.log('Creating database indexes...');
    await Company.collection.createIndex({
      name: 'text',
      normalizedName: 'text',
      aliases: 'text',
      industry: 'text'
    });

    console.log('Database initialization completed successfully!');

  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
