const mongoose = require('mongoose');

const BasicAnalysisSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  dataVersion: {
    type: String,
    default: '1.0'
  },
  generationTime: {
    type: Number,
    default: 0
  }
});

// TTL index - data expires after 24 hours
BasicAnalysisSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 86400 });

// Compound index for efficient queries
BasicAnalysisSchema.index({ companyId: 1, lastUpdated: -1 });

// Method to check if data is stale (older than 12 hours)
BasicAnalysisSchema.methods.isStale = function() {
  const hoursOld = (Date.now() - this.lastUpdated.getTime()) / (1000 * 60 * 60);
  return hoursOld > 12;
};

module.exports = mongoose.model('BasicAnalysis', BasicAnalysisSchema);
