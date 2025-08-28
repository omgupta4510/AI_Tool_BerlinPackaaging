// Routes for Trends & Regulations functionality
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Get industry trends data
router.post('/trends', async (req, res) => {
  try {
    const { industry, companyName } = req.body;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }

    console.log(`Fetching trends data for industry: ${industry}`);
    
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
            content: createTrendsPrompt(industry, companyName)
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
    console.log('Successfully fetched trends data from Perplexity');
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ error: 'Failed to fetch trends data', details: error.message });
  }
});

// Get regulations data
router.post('/regulations', async (req, res) => {
  try {
    const { industry, region, companyName } = req.body;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }

    console.log(`Fetching regulations data for industry: ${industry}, region: ${region || 'global'}`);
    
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
            content: createRegulationsPrompt(industry, region, companyName)
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
    console.log('Successfully fetched regulations data from Perplexity');
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching regulations:', error);
    res.status(500).json({ error: 'Failed to fetch regulations data', details: error.message });
  }
});

// Get combined trends and regulations analysis
router.post('/analysis', async (req, res) => {
  try {
    const { industry, region, companyName } = req.body;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }

    console.log(`Fetching combined analysis for industry: ${industry}`);
    
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
            content: createCombinedAnalysisPrompt(industry, region, companyName)
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
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
    console.log('Successfully fetched combined analysis from Perplexity');
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Failed to fetch analysis data', details: error.message });
  }
});

// Helper functions for creating prompts
function createTrendsPrompt(industry, companyName) {
  const companyContext = companyName ? ` Focus particularly on how these trends affect ${companyName}.` : '';
  
  return `Analyze the latest industry trends for the ${industry} sector in 2024-2025. ${companyContext}

Please provide a comprehensive analysis in JSON format with the following structure:

{
  "industryTrendsSummary": {
    "title": "Industry Trends Summary",
    "description": "Brief overview of critical market dynamics and opportunities",
    "marketReality": "Current state and pressures in the industry"
  },
  "salesOpportunities": [
    {
      "title": "Opportunity title",
      "description": "Detailed description of the opportunity",
      "priority": "High/Medium/Low"
    }
  ],
  "urgencyFactors": [
    {
      "title": "Urgency factor title",
      "description": "Description of the urgent market factor",
      "impact": "High/Medium/Low"
    }
  ],
  "keyTrends": [
    {
      "title": "Trend title",
      "description": "Detailed description",
      "priority": "Critical/High/Medium",
      "timeframe": "Current/6 months/1 year",
      "marketImpact": "Description of market impact"
    }
  ],
  "latestNews": [
    {
      "title": "News headline",
      "description": "Brief summary of recent development",
      "date": "Month Year",
      "source": "Source publication",
      "relevance": "How this impacts the industry"
    }
  ]
}

Focus on factual, recent information from 2024-2025 about market trends, technological developments, consumer behavior changes, and industry dynamics.`;
}

function createRegulationsPrompt(industry, region, companyName) {
  const regionContext = region ? ` in the ${region} region` : ' globally';
  const companyContext = companyName ? ` Pay special attention to regulations that specifically impact ${companyName}.` : '';
  
  return `Analyze the current and upcoming regulations affecting the ${industry} industry${regionContext}.${companyContext}

Please provide a comprehensive analysis in JSON format with the following structure:

{
  "regulationsOverview": {
    "title": "Regulatory Landscape Overview",
    "description": "Summary of key regulatory themes and their impact"
  },
  "regulationsByMaterial": [
    {
      "material": "Material name (e.g., PET, HDPE, etc.)",
      "regulations": [
        {
          "title": "Regulation title",
          "description": "Description of requirements",
          "timeframe": "2024-2027",
          "affectedRegions": ["Europe", "North America"],
          "complianceRequirements": "What companies need to do",
          "priority": "Critical/High/Medium"
        }
      ]
    }
  ],
  "upcomingRegulations": [
    {
      "title": "Regulation title",
      "description": "What the regulation entails",
      "effectiveDate": "Date when it takes effect",
      "regions": ["Affected regions"],
      "industryImpact": "How it affects the industry",
      "preparationTime": "How much time companies have to prepare"
    }
  ],
  "complianceRequirements": [
    {
      "requirement": "Specific compliance requirement",
      "deadline": "Compliance deadline",
      "regions": ["Applicable regions"],
      "penalties": "Consequences of non-compliance"
    }
  ]
}

Focus on factual, recent regulatory information including EU packaging regulations, recycling requirements, material restrictions, and other relevant compliance requirements for 2024-2025.`;
}

function createCombinedAnalysisPrompt(industry, region, companyName) {
  const regionContext = region ? ` in the ${region} region` : ' globally';
  const companyContext = companyName ? ` Provide specific insights for ${companyName}.` : '';
  
  return `Provide a strategic analysis combining industry trends and regulatory requirements for the ${industry} sector${regionContext}.${companyContext}

Please provide analysis in JSON format with the following structure:

{
  "strategicOverview": {
    "title": "Strategic Market Overview",
    "description": "High-level synthesis of trends and regulatory landscape"
  },
  "marketOpportunities": [
    {
      "opportunity": "Opportunity title",
      "description": "Detailed description",
      "trendDrivers": ["List of trends driving this opportunity"],
      "regulatorySupport": "How regulations support or hinder this opportunity",
      "timeToMarket": "Expected timeline",
      "investmentRequired": "Level of investment needed"
    }
  ],
  "riskFactors": [
    {
      "risk": "Risk title",
      "description": "Description of the risk",
      "probability": "High/Medium/Low",
      "impact": "High/Medium/Low",
      "mitigation": "Suggested mitigation strategies"
    }
  ],
  "actionableInsights": [
    {
      "insight": "Insight title",
      "description": "Detailed actionable recommendation",
      "priority": "Immediate/3 months/6 months",
      "expectedOutcome": "What success looks like"
    }
  ],
  "competitiveAdvantage": [
    {
      "advantage": "Advantage area",
      "description": "How to leverage trends and regulations for competitive advantage",
      "implementation": "How to implement this advantage"
    }
  ]
}

Focus on strategic recommendations that help companies navigate both market trends and regulatory requirements effectively.`;
}

module.exports = router;
