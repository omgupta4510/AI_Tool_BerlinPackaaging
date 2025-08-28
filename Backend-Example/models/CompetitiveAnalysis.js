const mongoose = require('mongoose');

const CompetitiveAnalysisSchema = new mongoose.Schema({
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
}, {
  timestamps: true
});

// TTL index - documents expire after 30 days
CompetitiveAnalysisSchema.index({ lastUpdated: 1 }, { expireAfterSeconds: 2592000 });

// Compound index for efficient queries
CompetitiveAnalysisSchema.index({ companyId: 1, lastUpdated: -1 });

CompetitiveAnalysisSchema.methods.isStale = function(hoursThreshold = 24) {
  const now = new Date();
  const hoursDiff = (now - this.lastUpdated) / (1000 * 60 * 60);
  return hoursDiff > hoursThreshold;
};

module.exports = mongoose.model('CompetitiveAnalysis', CompetitiveAnalysisSchema);
