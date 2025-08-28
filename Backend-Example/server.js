// Backend server for Perplexity API integration with MongoDB
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const connectDB = require('./config/database');
const imageSearchService = require('./services/imageSearchService');
const CompanySearchService = require('./services/companySearchService');

// Connect to MongoDB
connectDB();

// Import routes
const trendsRegulationsRoutes = require('./routes/trendsRegulations');
const commercialStrategyRoutes = require('./routes/commercialStrategy');
const winningMessageRoutes = require('./routes/winningMessage');
const productsRoutes = require('./routes/products');
const companySearchRoutes = require('./routes/companySearch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true // Your Vite frontend URL
// }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Use routes
app.use('/api/trends-regulations', trendsRegulationsRoutes);
app.use('/api/commercial-strategy', commercialStrategyRoutes);
app.use('/api/winning-message', winningMessageRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/companies', companySearchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running', timestamp: new Date().toISOString() });
});

// Perplexity API endpoint with MongoDB integration
app.post('/api/company-data', async (req, res) => {
  try {
    const { companyName, forceRefresh = false } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    console.log(`Processing request for: ${companyName}, forceRefresh: ${forceRefresh}`);
    
    // Find or create company in database
    const company = await CompanySearchService.findOrCreateCompany(companyName);
    const companyId = company._id;

    // Check if we have cached data and it's fresh
    if (!forceRefresh) {
      const dataStatus = await CompanySearchService.getCompanyDataStatus(companyId);
      const basicData = await CompanySearchService.getAnalysisData(companyId, 'basic');
      
      if (basicData && !dataStatus.basic?.isStale) {
        console.log(`Returning cached basic company data for: ${companyName}`);
        
        // Ensure the cached data has the logo from company record
        let cachedData = basicData.data;
        if (company.logo && cachedData.basicInfo) {
          cachedData.basicInfo.logo = company.logo;
        }
        
        return res.json({
          choices: [{
            message: {
              content: JSON.stringify(cachedData)
            }
          }],
          cached: true,
          lastUpdated: basicData.lastUpdated,
          company: {
            id: companyId,
            name: company.name
          }
        });
      }
    }

    // Generate new data if not cached or refresh requested
    console.log(`Generating fresh data for: ${companyName}`);
    const startTime = Date.now();
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: createCompanyPrompt(companyName)
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        return_citations: true,
        return_images: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const generationTime = Date.now() - startTime;
    console.log(`Successfully fetched data from Perplexity in ${generationTime}ms`);
    
    // Extract and enhance the response with company logo
    if (data.choices && data.choices[0]) {
      try {
        let content = data.choices[0].message.content;
        let parsedContent = null;
        
        // Try to parse as JSON to enhance with logo and save to database
        try {
          let jsonContent = content;
          
          // Extract JSON from markdown code blocks if present
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonContent = jsonMatch[1];
          }
          
          parsedContent = JSON.parse(jsonContent);
          
          // Add company logo if basicInfo exists and no logo yet
          if (parsedContent.basicInfo && !company.logo) {
            console.log(`Fetching logo for: ${companyName}`);
            const logoUrl = await imageSearchService.searchCompanyLogo(companyName);
            parsedContent.basicInfo.logo = logoUrl;
            
            // Update company with logo
            if (logoUrl) {
              await CompanySearchService.updateCompanyInfo(companyId, { logo: logoUrl });
            }
            
            // Update the content with enhanced data (keeping original format)
            if (jsonMatch) {
              // If it was in markdown, keep it in markdown
              data.choices[0].message.content = '```json\n' + JSON.stringify(parsedContent, null, 2) + '\n```';
            } else {
              // If it was plain JSON, keep it plain
              data.choices[0].message.content = JSON.stringify(parsedContent);
            }
            console.log(`Logo search completed: ${logoUrl}`);
          } else if (company.logo && parsedContent.basicInfo) {
            // Use cached logo
            parsedContent.basicInfo.logo = company.logo;
            data.choices[0].message.content = jsonMatch ? 
              '```json\n' + JSON.stringify(parsedContent, null, 2) + '\n```' :
              JSON.stringify(parsedContent);
          }

          // Save the parsed data to database
          if (parsedContent) {
            await CompanySearchService.saveAnalysisData(companyId, 'basic', parsedContent, generationTime);
            console.log(`Saved basic company data for: ${companyName}`);
          }

        } catch (parseError) {
          // If parsing fails, it might be plain text - leave as is
          console.log('Content is not JSON, leaving as is');
        }
      } catch (logoError) {
        console.error('Error fetching company logo:', logoError);
        // Continue without logo if search fails
      }
    }
    
    // Add metadata to response
    data.cached = false;
    data.generationTime = generationTime;
    data.company = {
      id: companyId,
      name: company.name
    };
    
    res.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch company data', details: error.message });
  }
});

// Test endpoint for company logo search
app.post('/api/test-logo-search', async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ 
        error: 'Company name is required' 
      });
    }

    console.log(`Testing logo search for: ${companyName}`);
    
    const logoUrl = await imageSearchService.searchCompanyLogo(companyName);
    
    res.json({
      success: true,
      data: {
        companyName,
        logoUrl,
        searchQuery: `${companyName} logo image`
      },
      cacheStats: imageSearchService.getCacheStats()
    });
    
  } catch (error) {
    console.error('Error in logo search test:', error);
    res.status(500).json({ 
      error: 'Failed to search for logo',
      details: error.message 
    });
  }
});

// New endpoint for sustainability data
app.post('/api/sustainability-data', async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    console.log(`Fetching sustainability data for: ${companyName}`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'user',
            content: createSustainabilityPrompt(companyName)
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        return_citations: true,
        return_images: false
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Perplexity API error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched sustainability data from Perplexity');
    res.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch sustainability data', details: error.message });
  }
});

function createCompanyPrompt(companyName) {
  return `
You are a business intelligence analyst. Provide comprehensive information about "${companyName}" in the following JSON format. Be accurate and use the most recent data available. If any information is not available, use "Not Available" as the value.

{
  "basicInfo": {
    "name": "Full official company name",
    "description": "2-3 sentence company description focusing on what they do and their market position",
    "industry": "Primary industry category",
    "vertical": "Specific market vertical or segment",
    "headquarters": "City, State/Country",
    "foundingYear": Year as number,
    "website": "Official website URL",
    "onlineStore": "E-commerce website URL if applicable"
  },
  "employees": {
    "total": "Employee count as string (e.g., '50,000+')",
    "breakdown": {
      "retail": Number of retail employees if applicable,
      "corporate": Number of corporate employees if applicable,
      "logistics": Number of logistics employees if applicable,
      "other": Other employees if applicable
    }
  },
  "productCategories": ["Array of main product/service categories"],
  "globalPresence": ["Array of countries/regions where company operates"],
  "financialData": {
    "annualRevenue": "Annual revenue as string with currency",
    "marketCap": "Market capitalization as string with currency",
    "keyMarkets": [
      {
        "region": "Geographic region",
        "marketShare": "Market share percentage if known"
      }
    ]
  },
  "keyContacts": [
    {
      "name": "Executive name",
      "title": "Job title (CEO, CFO, CMO, etc.)",
      "tenure": "Years in position if known"
    }
  ],
  "recentNews": [
    {
      "headline": "Recent news headline",
      "date": "Date in 'X days/weeks ago' format",
      "summary": "Brief 1-2 sentence summary",
      "source": "News source name"
    }
  ],
  "competitors": ["Array of main competitors"],
  "recentFunding": {
    "amount": "Funding amount if recent",
    "date": "Funding date",
    "round": "Funding round type"
  },
  "partnerships": ["Array of notable partnerships"]
}

Provide accurate, up-to-date information. Focus on business-relevant details that would be useful for sales teams.
`;
}

function createSustainabilityPrompt(companyName) {
  return `
You are a sustainability analyst. Provide comprehensive sustainability information about "${companyName}" in the following JSON format. Be accurate and use the most recent data available. If any information is not available, use reasonable estimates based on industry standards or mark as "Not Available".

{
  "summary": "2-3 sentences analyzing the company's position on sustainability, focusing on their strategy and market position",
  "archetype": {
    "category": "One of: 'Core Sustainability brands', 'Green Innovators', 'Traditional Adapters', 'Compliance Focused'",
    "description": "Brief description of why they fit this archetype"
  },
  "marketPosition": {
    "ranking": "One of: 'Above average', 'Average', 'Below average'",
    "marketContext": "2-3 sentences comparing their sustainability performance to industry peers"
  },
  "strengths": [
    {
      "title": "Strength category (e.g., 'Strong Leadership', 'Innovation Focus')",
      "description": "Brief description of this strength"
    }
  ],
  "improvementAreas": [
    {
      "title": "Area needing improvement (e.g., 'Supply Chain', 'Reporting')",
      "description": "Brief description of what could be improved"
    }
  ],
  "productClaims": {
    "description": "Description of sustainability claims made in product marketing and descriptions"
  },
  "packagingAssessment": {
    "description": "Assessment of packaging sustainability including materials used and initiatives"
  },
  "certifications": [
    {
      "name": "Certification name (e.g., 'B Corp', 'ISO 14001', 'LEED')",
      "status": "One of: 'certified', 'not-certified', 'in-progress'",
      "description": "Brief description of the certification"
    }
  ],
  "esgScores": {
    "score": "ESG scores from major rating agencies (MSCI, Sustainalytics, etc.)",
    "description": "Brief explanation of the scores"
  },
  "initiatives": [
    {
      "title": "Sustainability initiative title",
      "completed": true or false
    }
  ],
  "publicCommitments": [
    {
      "title": "Public commitment title (e.g., 'Net zero by 2030')",
      "completed": true or false
    }
  ],
  "narrativeSignals": [
    {
      "category": "Category (e.g., 'Website Communication', 'Brand Mission & Vision')",
      "description": "Description of how sustainability is communicated"
    }
  ]
}

Focus on factual, recent information about their sustainability practices, certifications, commitments, and market positioning.
`;
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}/api`);
  console.log(`🔑 Perplexity API Key configured: ${process.env.PERPLEXITY_API_KEY ? 'Yes' : 'No'}`);
});
