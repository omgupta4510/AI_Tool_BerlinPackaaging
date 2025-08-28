const Company = require('../models/Company');
const BasicAnalysis = require('../models/BasicAnalysis');
const ProductAnalysis = require('../models/ProductAnalysis');
const CompetitiveAnalysis = require('../models/CompetitiveAnalysis');
const TrendsAnalysis = require('../models/TrendsAnalysis');
const CommercialStrategy = require('../models/CommercialStrategy');
const {
  normalizeCompanyName,
  generateCompanyAliases,
  searchCompanies,
  extractDomain,
  validateCompanyData
} = require('../utils/companySearchUtils');

class CompanySearchService {
  /**
   * Search for companies by name with intelligent matching
   */
  static async searchCompaniesByName(query, limit = 10) {
    try {
      if (!query || query.trim().length < 2) {
        return [];
      }

      const normalizedQuery = normalizeCompanyName(query);
      
      // First try exact and alias matches for better performance
      let companies = await Company.find({
        $or: [
          { normalizedName: normalizedQuery },
          { aliases: { $in: [normalizedQuery] } },
          { normalizedName: { $regex: normalizedQuery, $options: 'i' } },
          { name: { $regex: query.trim(), $options: 'i' } }
        ]
      })
      .sort({ searchCount: -1, createdAt: -1 })
      .limit(limit * 2) // Get more results for scoring
      .lean();

      // If no results, try text search
      if (companies.length === 0) {
        companies = await Company.find({
          $text: { $search: query }
        }, {
          score: { $meta: 'textScore' }
        })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit * 2)
        .lean();
      }

      // Apply intelligent scoring and ranking
      const scoredResults = searchCompanies(query, companies, limit);
      
      return scoredResults.map(company => ({
        id: company._id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        logo: company.logo,
        similarity: company.similarity,
        searchCount: company.searchCount || 0
      }));

    } catch (error) {
      console.error('Error searching companies:', error);
      throw new Error('Company search failed');
    }
  }

  /**
   * Find or create a company by name
   */
  static async findOrCreateCompany(companyName, additionalData = {}) {
    try {
      const normalizedName = normalizeCompanyName(companyName);
      
      // First try to find existing company
      let company = await this.findExistingCompany(companyName);
      
      if (company) {
        // Update search statistics
        await company.updateSearchStats();
        return company;
      }

      // Create new company
      const aliases = generateCompanyAliases(companyName);
      const companyData = {
        name: companyName.trim(),
        normalizedName,
        aliases,
        ...additionalData
      };

      // Validate data
      const validation = validateCompanyData(companyData);
      if (!validation.isValid) {
        throw new Error(`Invalid company data: ${validation.errors.join(', ')}`);
      }

      company = new Company(companyData);
      await company.save();
      
      console.log(`Created new company: ${companyName}`);
      return company;

    } catch (error) {
      console.error('Error finding/creating company:', error);
      throw error;
    }
  }

  /**
   * Find existing company using various matching strategies
   */
  static async findExistingCompany(companyName) {
    try {
      const normalizedName = normalizeCompanyName(companyName);
      const aliases = generateCompanyAliases(companyName);

      // Try different matching strategies in order of preference
      const searchStrategies = [
        // Exact normalized name match
        { normalizedName },
        
        // Exact alias match
        { aliases: { $in: [normalizedName] } },
        
        // Original name variations
        { name: { $regex: `^${companyName.trim()}$`, $options: 'i' } },
        
        // Fuzzy matches in aliases
        { aliases: { $in: aliases } },
        
        // Partial match in normalized name
        { normalizedName: { $regex: normalizedName, $options: 'i' } }
      ];

      for (const strategy of searchStrategies) {
        const company = await Company.findOne(strategy);
        if (company) {
          return company;
        }
      }

      return null;

    } catch (error) {
      console.error('Error finding existing company:', error);
      return null;
    }
  }

  /**
   * Get company data status (what analyses are available and how fresh they are)
   */
  static async getCompanyDataStatus(companyId) {
    try {
      const cacheThresholdHours = parseInt(process.env.CACHE_DURATION_HOURS) || 24;
      const status = {};

      // Check each analysis type
      const analysisTypes = [
        { model: BasicAnalysis, key: 'basic' },
        { model: ProductAnalysis, key: 'products' },
        { model: CompetitiveAnalysis, key: 'competitive' },
        { model: TrendsAnalysis, key: 'trends' },
        { model: CommercialStrategy, key: 'commercial' }
      ];

      for (const { model, key } of analysisTypes) {
        const analysis = await model
          .findOne({ companyId })
          .sort({ lastUpdated: -1 });

        if (analysis) {
          const hoursOld = (Date.now() - analysis.lastUpdated.getTime()) / (1000 * 60 * 60);
          status[key] = {
            exists: true,
            lastUpdated: analysis.lastUpdated,
            hoursOld: Math.round(hoursOld * 100) / 100,
            isStale: hoursOld > cacheThresholdHours,
            dataVersion: analysis.dataVersion
          };
        } else {
          status[key] = {
            exists: false,
            lastUpdated: null,
            hoursOld: null,
            isStale: true,
            dataVersion: null
          };
        }
      }

      return status;

    } catch (error) {
      console.error('Error getting company data status:', error);
      throw error;
    }
  }

  /**
   * Get specific analysis data for a company
   */
  static async getAnalysisData(companyId, analysisType) {
    try {
      const modelMap = {
        'basic': BasicAnalysis,
        'products': ProductAnalysis,
        'competitive': CompetitiveAnalysis,
        'trends': TrendsAnalysis,
        'commercial': CommercialStrategy
      };

      const model = modelMap[analysisType];
      if (!model) {
        throw new Error(`Invalid analysis type: ${analysisType}`);
      }

      const analysis = await model
        .findOne({ companyId })
        .sort({ lastUpdated: -1 });

      return analysis ? {
        data: analysis.data,
        lastUpdated: analysis.lastUpdated,
        dataVersion: analysis.dataVersion,
        generationTime: analysis.generationTime
      } : null;

    } catch (error) {
      console.error(`Error getting ${analysisType} analysis:`, error);
      throw error;
    }
  }

  /**
   * Save or update analysis data
   */
  static async saveAnalysisData(companyId, analysisType, data, generationTime = 0) {
    try {
      const modelMap = {
        'basic': BasicAnalysis,
        'products': ProductAnalysis,
        'competitive': CompetitiveAnalysis,
        'trends': TrendsAnalysis,
        'commercial': CommercialStrategy
      };

      const model = modelMap[analysisType];
      if (!model) {
        throw new Error(`Invalid analysis type: ${analysisType}`);
      }

      const analysisData = {
        companyId,
        data,
        lastUpdated: new Date(),
        generationTime
      };

      // Upsert the analysis data
      const result = await model.findOneAndUpdate(
        { companyId },
        analysisData,
        { 
          upsert: true, 
          new: true,
          setDefaultsOnInsert: true 
        }
      );

      console.log(`Saved ${analysisType} analysis for company ${companyId}`);
      return result;

    } catch (error) {
      console.error(`Error saving ${analysisType} analysis:`, error);
      throw error;
    }
  }

  /**
   * Update company information
   */
  static async updateCompanyInfo(companyId, updateData) {
    try {
      // Validate update data
      const validation = validateCompanyData({ name: 'temp', ...updateData });
      if (!validation.isValid) {
        throw new Error(`Invalid update data: ${validation.errors.join(', ')}`);
      }

      const company = await Company.findByIdAndUpdate(
        companyId,
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { new: true }
      );

      return company;

    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  }

  /**
   * Get popular/trending companies
   */
  static async getPopularCompanies(limit = 10) {
    try {
      const companies = await Company.find({})
        .sort({ 
          searchCount: -1, 
          lastSearched: -1 
        })
        .limit(limit)
        .select('name industry description logo searchCount')
        .lean();

      return companies.map(company => ({
        id: company._id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        logo: company.logo,
        searchCount: company.searchCount
      }));

    } catch (error) {
      console.error('Error getting popular companies:', error);
      throw error;
    }
  }

  /**
   * Get companies by industry
   */
  static async getCompaniesByIndustry(industry, limit = 20) {
    try {
      const companies = await Company.find({
        industry: { $regex: industry, $options: 'i' }
      })
      .sort({ searchCount: -1 })
      .limit(limit)
      .select('name industry description logo')
      .lean();

      return companies.map(company => ({
        id: company._id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        logo: company.logo
      }));

    } catch (error) {
      console.error('Error getting companies by industry:', error);
      throw error;
    }
  }

  /**
   * Clean up stale data
   */
  static async cleanupStaleData(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
      
      const models = [ProductAnalysis, CompetitiveAnalysis, TrendsAnalysis, CommercialStrategy];
      
      for (const model of models) {
        const result = await model.deleteMany({
          lastUpdated: { $lt: cutoffDate }
        });
        
        if (result.deletedCount > 0) {
          console.log(`Cleaned up ${result.deletedCount} stale ${model.modelName} records`);
        }
      }

    } catch (error) {
      console.error('Error cleaning up stale data:', error);
      throw error;
    }
  }
}

module.exports = CompanySearchService;
