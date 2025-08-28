const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  normalizedName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  aliases: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  industry: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  searchCount: {
    type: Number,
    default: 1
  },
  lastSearched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for search
CompanySchema.index({
  name: 'text',
  normalizedName: 'text',
  aliases: 'text',
  industry: 'text'
});

// Compound index for efficient queries
CompanySchema.index({ normalizedName: 1, createdAt: -1 });

CompanySchema.methods.updateSearchStats = function() {
  this.searchCount += 1;
  this.lastSearched = new Date();
  return this.save();
};

module.exports = mongoose.model('Company', CompanySchema);
