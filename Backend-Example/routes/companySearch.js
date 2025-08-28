const express = require('express');
const router = express.Router();
const CompanySearchService = require('../services/companySearchService');
const imageSearchService = require('../services/imageSearchService');

/**
 * Search for companies by name
 * POST /api/companies/search
 */
router.post('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;

    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const companies = await CompanySearchService.searchCompaniesByName(query, limit);
    
    res.json({
      query,
      results: companies,
      count: companies.length
    });

  } catch (error) {
    console.error('Company search error:', error);
    res.status(500).json({ 
      error: 'Failed to search companies',
      message: error.message 
    });
  }
});

/**
 * Find or create a company and get data status
 * POST /api/companies/find-or-create
 */
router.post('/find-or-create', async (req, res) => {
  try {
    const { companyName, industry, description, website } = req.body;

    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Find or create company
    const company = await CompanySearchService.findOrCreateCompany(companyName, {
      industry,
      description,
      website
    });

    // Get logo if not already available
    if (!company.logo && companyName) {
      try {
        console.log(`Fetching logo for: ${companyName}`);
        const logoUrl = await imageSearchService.searchCompanyLogo(companyName);
        if (logoUrl) {
          await CompanySearchService.updateCompanyInfo(company._id, { logo: logoUrl });
          company.logo = logoUrl;
        }
      } catch (logoError) {
        console.warn('Failed to fetch logo:', logoError.message);
      }
    }

    // Get data status for all analysis types
    const dataStatus = await CompanySearchService.getCompanyDataStatus(company._id);

    res.json({
      company: {
        id: company._id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        logo: company.logo,
        website: company.website,
        searchCount: company.searchCount
      },
      dataStatus,
      isNewCompany: Date.now() - company.createdAt.getTime() < 5000 // Created within last 5 seconds
    });

  } catch (error) {
    console.error('Find/create company error:', error);
    res.status(500).json({ 
      error: 'Failed to find or create company',
      message: error.message 
    });
  }
});

/**
 * Get specific analysis data for a company
 * GET /api/companies/:companyId/analysis/:type
 */
router.get('/:companyId/analysis/:type', async (req, res) => {
  try {
    const { companyId, type } = req.params;
    
    const validTypes = ['products', 'competitive', 'trends', 'commercial'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid analysis type' });
    }

    const analysisData = await CompanySearchService.getAnalysisData(companyId, type);
    
    if (!analysisData) {
      return res.status(404).json({ 
        error: 'Analysis data not found',
        type,
        companyId
      });
    }

    res.json({
      type,
      companyId,
      ...analysisData
    });

  } catch (error) {
    console.error('Get analysis data error:', error);
    res.status(500).json({ 
      error: 'Failed to get analysis data',
      message: error.message 
    });
  }
});

/**
 * Save analysis data for a company
 * POST /api/companies/:companyId/analysis/:type
 */
router.post('/:companyId/analysis/:type', async (req, res) => {
  try {
    const { companyId, type } = req.params;
    const { data, generationTime } = req.body;
    
    const validTypes = ['products', 'competitive', 'trends', 'commercial'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid analysis type' });
    }

    if (!data) {
      return res.status(400).json({ error: 'Analysis data is required' });
    }

    const savedAnalysis = await CompanySearchService.saveAnalysisData(
      companyId, 
      type, 
      data, 
      generationTime || 0
    );

    res.json({
      success: true,
      type,
      companyId,
      lastUpdated: savedAnalysis.lastUpdated,
      dataVersion: savedAnalysis.dataVersion
    });

  } catch (error) {
    console.error('Save analysis data error:', error);
    res.status(500).json({ 
      error: 'Failed to save analysis data',
      message: error.message 
    });
  }
});

/**
 * Check if analysis data needs refresh
 * GET /api/companies/:companyId/status
 */
router.get('/:companyId/status', async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const dataStatus = await CompanySearchService.getCompanyDataStatus(companyId);
    
    res.json({
      companyId,
      dataStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get company status error:', error);
    res.status(500).json({ 
      error: 'Failed to get company status',
      message: error.message 
    });
  }
});

/**
 * Update company information
 * PUT /api/companies/:companyId
 */
router.put('/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.searchCount;

    const updatedCompany = await CompanySearchService.updateCompanyInfo(companyId, updateData);
    
    if (!updatedCompany) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      company: {
        id: updatedCompany._id,
        name: updatedCompany.name,
        industry: updatedCompany.industry,
        description: updatedCompany.description,
        logo: updatedCompany.logo,
        website: updatedCompany.website
      }
    });

  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({ 
      error: 'Failed to update company',
      message: error.message 
    });
  }
});

/**
 * Get popular/trending companies
 * GET /api/companies/popular
 */
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const companies = await CompanySearchService.getPopularCompanies(parseInt(limit));
    
    res.json({
      companies,
      count: companies.length
    });

  } catch (error) {
    console.error('Get popular companies error:', error);
    res.status(500).json({ 
      error: 'Failed to get popular companies',
      message: error.message 
    });
  }
});

/**
 * Get companies by industry
 * GET /api/companies/industry/:industry
 */
router.get('/industry/:industry', async (req, res) => {
  try {
    const { industry } = req.params;
    const { limit = 20 } = req.query;
    
    const companies = await CompanySearchService.getCompaniesByIndustry(industry, parseInt(limit));
    
    res.json({
      industry,
      companies,
      count: companies.length
    });

  } catch (error) {
    console.error('Get companies by industry error:', error);
    res.status(500).json({ 
      error: 'Failed to get companies by industry',
      message: error.message 
    });
  }
});

/**
 * Health check for company search service
 * GET /api/companies/health
 */
router.get('/health', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'healthy',
      database: dbStatus,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
