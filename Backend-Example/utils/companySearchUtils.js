const Fuse = require('fuse.js');

/**
 * Normalize company name for consistent searching
 */
function normalizeCompanyName(name) {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .trim()
    // Remove common company suffixes
    .replace(/\b(inc|incorporated|corp|corporation|llc|ltd|limited|co|company|plc|group|holdings|international|global|worldwide|enterprises|industries|technologies|systems|solutions|services)\b\.?$/gi, '')
    // Remove special characters except spaces, hyphens, and ampersands
    .replace(/[^\w\s\-&]/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate company aliases for better matching
 */
function generateCompanyAliases(name) {
  if (!name) return [];
  
  const normalized = normalizeCompanyName(name);
  const aliases = new Set([normalized, name.toLowerCase().trim()]);
  
  // Split into words for processing
  const words = normalized.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return Array.from(aliases);
  
  // Add initials (e.g., "General Electric" -> "ge")
  if (words.length > 1) {
    const initials = words.map(word => word.charAt(0)).join('');
    if (initials.length >= 2) {
      aliases.add(initials);
    }
  }
  
  // Add variations without common words
  const stopWords = ['the', 'and', 'of', 'for', 'to', 'in', 'on', 'at', 'by', 'with'];
  const filteredWords = words.filter(word => !stopWords.includes(word));
  
  if (filteredWords.length !== words.length && filteredWords.length > 0) {
    aliases.add(filteredWords.join(' '));
  }
  
  // Add abbreviated forms
  const abbreviations = {
    'corporation': ['corp'],
    'company': ['co'],
    'limited': ['ltd'],
    'international': ['intl', 'int'],
    'technologies': ['tech', 'technology'],
    'systems': ['sys', 'system'],
    'solutions': ['sol'],
    'services': ['svc'],
    'industries': ['ind'],
    'enterprises': ['ent'],
    'manufacturing': ['mfg'],
    'association': ['assoc', 'assn']
  };
  
  let abbreviated = normalized;
  Object.keys(abbreviations).forEach(full => {
    abbreviations[full].forEach(abbrev => {
      const pattern = new RegExp(`\\b${full}\\b`, 'g');
      if (pattern.test(abbreviated)) {
        aliases.add(abbreviated.replace(pattern, abbrev));
      }
    });
  });
  
  // Add common variations
  if (normalized.includes('&')) {
    aliases.add(normalized.replace(/&/g, 'and'));
    aliases.add(normalized.replace(/&/g, ''));
  }
  
  if (normalized.includes('and')) {
    aliases.add(normalized.replace(/\band\b/g, '&'));
  }
  
  // Remove duplicates and empty strings
  return Array.from(aliases).filter(alias => alias && alias.length > 0);
}

/**
 * Calculate similarity score between search query and company data
 */
function calculateSimilarity(query, company) {
  if (!query || !company) return 0;
  
  const queryNormalized = normalizeCompanyName(query);
  const companyNameNormalized = normalizeCompanyName(company.name);
  
  // Exact match
  if (queryNormalized === companyNameNormalized) return 1.0;
  
  // Check against aliases
  if (company.aliases && Array.isArray(company.aliases)) {
    for (const alias of company.aliases) {
      if (alias === queryNormalized) return 0.95;
      if (alias.includes(queryNormalized) && queryNormalized.length > 2) return 0.9;
    }
  }
  
  // Starts with match
  if (companyNameNormalized.startsWith(queryNormalized)) return 0.85;
  
  // Contains match
  if (companyNameNormalized.includes(queryNormalized)) return 0.75;
  
  // Word-based similarity using Fuse.js
  const fuse = new Fuse([{
    name: company.name,
    normalizedName: companyNameNormalized,
    aliases: company.aliases || []
  }], {
    keys: ['name', 'normalizedName', 'aliases'],
    threshold: 0.6,
    includeScore: true
  });
  
  const fuseResults = fuse.search(query);
  if (fuseResults.length > 0) {
    // Fuse.js returns score where 0 is perfect match, 1 is no match
    // Convert to our scale where 1 is perfect match, 0 is no match
    return Math.max(0, 1 - fuseResults[0].score) * 0.7;
  }
  
  return 0;
}

/**
 * Search companies by name with intelligent matching
 */
function searchCompanies(query, companies, limit = 10) {
  if (!query || !companies || companies.length === 0) {
    return [];
  }
  
  // Calculate similarity scores
  const scoredCompanies = companies
    .map(company => ({
      ...company,
      similarity: calculateSimilarity(query, company)
    }))
    .filter(company => company.similarity > 0.3) // Minimum threshold
    .sort((a, b) => {
      // Primary sort by similarity score
      if (b.similarity !== a.similarity) {
        return b.similarity - a.similarity;
      }
      // Secondary sort by search count (popularity)
      return (b.searchCount || 0) - (a.searchCount || 0);
    })
    .slice(0, limit);
  
  return scoredCompanies;
}

/**
 * Extract domain from URL or email
 */
function extractDomain(input) {
  if (!input) return null;
  
  try {
    // If it looks like an email
    if (input.includes('@')) {
      return input.split('@')[1].toLowerCase();
    }
    
    // If it looks like a URL
    if (input.includes('://')) {
      const url = new URL(input);
      return url.hostname.toLowerCase();
    }
    
    // If it's just a domain
    if (input.includes('.')) {
      return input.toLowerCase().replace(/^www\./, '');
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Validate company data before saving
 */
function validateCompanyData(companyData) {
  const errors = [];
  
  if (!companyData.name || companyData.name.trim().length === 0) {
    errors.push('Company name is required');
  }
  
  if (companyData.name && companyData.name.length > 255) {
    errors.push('Company name must be less than 255 characters');
  }
  
  if (companyData.website && !isValidUrl(companyData.website)) {
    errors.push('Invalid website URL format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  normalizeCompanyName,
  generateCompanyAliases,
  calculateSimilarity,
  searchCompanies,
  extractDomain,
  validateCompanyData,
  isValidUrl
};
