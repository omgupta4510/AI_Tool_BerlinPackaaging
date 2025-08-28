const express = require('express');
const fetch = require('node-fetch');
const imageSearchService = require('../services/imageSearchService');
const router = express.Router();

// Generate product and packaging data for a company
router.post('/analysis', async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    console.log(`Generating product analysis for: ${companyName}`);
    
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
            content: createProductAnalysisPrompt(companyName)
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        return_citations: true,
        return_images: false
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from Perplexity API');
    }

    let content;
    try {
      let responseText = data.choices[0].message.content;
      
      // Handle JSON wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      } else {
        // Try to find JSON object directly
        const directJsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (directJsonMatch) {
          responseText = directJsonMatch[0];
        }
      }
      
      content = JSON.parse(responseText);
      
      // Enhance products with images using SerpApi
      if (content.currentProducts && Array.isArray(content.currentProducts)) {
        console.log(`Fetching images for ${content.currentProducts.length} products...`);
        content.currentProducts = await imageSearchService.searchMultipleProductImages(
          companyName, 
          content.currentProducts
        );
        console.log('Image search completed');
      }
      
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      content = createFallbackProductAnalysis(companyName);
    }

    res.json({
      success: true,
      data: content,
      metadata: {
        companyName,
        timestamp: new Date().toISOString(),
        citations: data.citations || []
      }
    });
    
  } catch (error) {
    console.error('Error generating product analysis:', error);
    res.status(500).json({ 
      error: 'Failed to generate product analysis',
      details: error.message 
    });
  }
});

// Test endpoint for image search
router.post('/test-image-search', async (req, res) => {
  try {
    const { companyName, productName } = req.body;
    
    if (!companyName || !productName) {
      return res.status(400).json({ 
        error: 'Both companyName and productName are required' 
      });
    }

    console.log(`Testing image search for: ${companyName} - ${productName}`);
    
    const imageUrl = await imageSearchService.searchProductImage(companyName, productName);
    
    res.json({
      success: true,
      data: {
        companyName,
        productName,
        imageUrl,
        searchQuery: `${companyName} ${productName} product image`
      },
      cacheStats: imageSearchService.getCacheStats()
    });
    
  } catch (error) {
    console.error('Error in image search test:', error);
    res.status(500).json({ 
      error: 'Failed to search for image',
      details: error.message 
    });
  }
});

// Endpoint to clear image cache
router.post('/clear-image-cache', (req, res) => {
  try {
    imageSearchService.clearCache();
    res.json({
      success: true,
      message: 'Image cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear cache',
      details: error.message
    });
  }
});

function createProductAnalysisPrompt(companyName) {
  return `
You are a packaging industry sales analyst. Analyze "${companyName}" and provide detailed information about their products and current packaging solutions in the following JSON format. Focus on identifying packaging opportunities for a packaging supplier company.

{
  "companyOverview": {
    "name": "${companyName}",
    "industry": "Primary industry",
    "productCategories": ["Array of main product categories they sell"]
  },
  "currentProducts": [
    {
      "id": 1,
      "name": "Product name",
      "category": "Product category (e.g., Beverage, Food, Cosmetics, Pharmaceuticals)",
      "description": "Brief product description",
      "imageUrl": "Product image URL if available from web search",
      "currentPackaging": {
        "primaryPackaging": "Main packaging type (e.g., Glass Bottle, Plastic Bottle, Aluminum Can, Tube, Jar, Pouch)",
        "material": "Packaging material (e.g., PET, Glass, Aluminum, HDPE, Paperboard)",
        "size": "Package size/volume",
        "features": ["Array of packaging features like 'Recyclable', 'Tamper-evident', 'Child-resistant']"
      },
      "packagingOpportunities": {
        "sustainabilityUpgrade": "Potential eco-friendly packaging alternatives",
        "costOptimization": "Ways to reduce packaging costs",
        "brandEnhancement": "Premium packaging options to enhance brand appeal",
        "functionalImprovements": "Packaging improvements for user experience"
      }
    }
  ],
  "packagingAnalysis": {
    "currentPackagingTypes": [
      {
        "type": "Packaging type (e.g., Bottles, Tubes, Cans)",
        "material": "Material used",
        "usage": "How widely used in their product line",
        "estimatedVolume": "Estimated annual packaging volume if known"
      }
    ],
    "packagingSpend": {
      "estimatedAnnual": "Estimated annual packaging spend",
      "primaryCategories": ["Main packaging cost categories"]
    },
    "supplierOpportunities": [
      {
        "category": "Packaging category (e.g., Primary Packaging, Secondary Packaging)",
        "opportunity": "Specific opportunity description",
        "priority": "High/Medium/Low",
        "potentialValue": "Estimated business value"
      }
    ]
  },
  "recommendations": {
    "upcomingTrends": [
      {
        "trend": "Packaging trend relevant to this company",
        "description": "How this trend applies to their products",
        "timeline": "Expected adoption timeline"
      }
    ],
    "packagingInnovations": [
      {
        "innovation": "Packaging innovation or new material",
        "applicability": "How it could benefit their products",
        "sustainability": "Environmental benefits if any"
      }
    ],
    "salesApproach": {
      "keyDecisionMakers": ["Likely packaging decision makers in the company"],
      "painPoints": ["Current packaging challenges they likely face"],
      "valueProposition": ["Key value propositions for packaging supplier"]
    }
  }
}

Instructions:
1. Research actual products from ${companyName} and their current packaging
2. Provide real product names and accurate packaging descriptions
3. Focus on identifying specific packaging opportunities
4. Include at least 5 products if the company has that many
5. Be specific about packaging materials and types
6. Consider sustainability trends and cost optimization opportunities
7. Provide actionable insights for packaging sales teams
8. If product images aren't available, use "Not Available" for imageUrl
`;
}

function createFallbackProductAnalysis(companyName) {
  return {
    companyOverview: {
      name: companyName,
      industry: "To be determined",
      productCategories: ["Product analysis pending"]
    },
    currentProducts: [
      {
        id: 1,
        name: "Product information unavailable",
        category: "General",
        description: "Detailed product analysis is currently unavailable. Please try again later.",
        imageUrl: "Not Available",
        currentPackaging: {
          primaryPackaging: "To be analyzed",
          material: "Unknown",
          size: "Various",
          features: ["Analysis pending"]
        },
        packagingOpportunities: {
          sustainabilityUpgrade: "Analysis pending",
          costOptimization: "Analysis pending",
          brandEnhancement: "Analysis pending",
          functionalImprovements: "Analysis pending"
        }
      }
    ],
    packagingAnalysis: {
      currentPackagingTypes: [
        {
          type: "Various",
          material: "Multiple",
          usage: "Unknown",
          estimatedVolume: "To be determined"
        }
      ],
      packagingSpend: {
        estimatedAnnual: "Analysis pending",
        primaryCategories: ["To be determined"]
      },
      supplierOpportunities: [
        {
          category: "General Packaging",
          opportunity: "Comprehensive packaging analysis needed",
          priority: "High",
          potentialValue: "To be assessed"
        }
      ]
    },
    recommendations: {
      upcomingTrends: [
        {
          trend: "Sustainable Packaging",
          description: "General trend towards eco-friendly packaging solutions",
          timeline: "Ongoing"
        }
      ],
      packagingInnovations: [
        {
          innovation: "Smart Packaging",
          applicability: "Could benefit various product categories",
          sustainability: "Potential for reduced waste"
        }
      ],
      salesApproach: {
        keyDecisionMakers: ["Procurement Manager", "Product Manager"],
        painPoints: ["Cost optimization", "Sustainability requirements"],
        valueProposition: ["Cost savings", "Sustainable solutions", "Quality improvements"]
      }
    }
  };
}

module.exports = router;
