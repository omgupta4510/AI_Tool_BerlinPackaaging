// Service for Trends & Regulations API calls
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

// Mock data fallback
const mockTrendsData = {
  choices: [{
    message: {
      content: JSON.stringify({
        industryTrendsSummary: {
          title: "Industry Trends Summary",
          description: "Critical market dynamics and opportunities for personal care & beauty packaging",
          marketReality: "The Personal Care & Beauty industry is experiencing significant pressure to adopt sustainable packaging solutions."
        },
        salesOpportunities: [
          {
            title: "Implementing sustainable packaging solutions",
            description: "Growing demand for eco-friendly packaging materials and design-for-recycling approaches",
            priority: "High"
          }
        ],
        urgencyFactors: [
          {
            title: "New EU packaging regulations creating compliance deadlines",
            description: "Immediate action required for companies selling in European markets",
            impact: "High"
          }
        ],
        keyTrends: [
          {
            title: "Circular Economy Integration in Personal Care & Beauty",
            description: "Companies implementing circular packaging models to reduce waste and improve resource efficiency",
            priority: "Critical",
            timeframe: "Current",
            marketImpact: "Leading brands are investing in closed-loop packaging systems"
          }
        ],
        latestNews: [
          {
            title: "New Packaging Regulations Impact Personal Care & Beauty Companies",
            description: "Recent regulatory updates introduce stricter requirements for packaging recyclability",
            date: "November 2024",
            source: "European Packaging Authority",
            relevance: "Directly affects Premium Lifestyle & Wellness companies' packaging strategies"
          }
        ]
      })
    }
  }]
};

const mockRegulationsData = {
  choices: [{
    message: {
      content: JSON.stringify({
        regulationsOverview: {
          title: "Regulatory Landscape Overview",
          description: "Summary of key regulatory themes affecting packaging in the personal care and beauty industry"
        },
        regulationsByMaterial: [
          {
            material: "PET",
            regulations: [
              {
                title: "PET Recycled Content Requirements for Personal Care & Beauty",
                description: "Personal Care & Beauty companies must incorporate minimum percentages of recycled PET content",
                timeframe: "2025-2030",
                affectedRegions: ["Europe", "North America"],
                complianceRequirements: "Minimum 25% recycled content by 2025, increasing to 50% by 2030",
                priority: "Critical"
              }
            ]
          }
        ],
        upcomingRegulations: [
          {
            title: "Extended Producer Responsibility for Beauty Packaging",
            description: "New requirements for beauty companies to take responsibility for packaging end-of-life",
            effectiveDate: "January 2026",
            regions: ["Europe", "North America"],
            industryImpact: "Companies must establish take-back programs and contribute to recycling infrastructure",
            preparationTime: "18 months to establish compliance systems"
          }
        ],
        complianceRequirements: [
          {
            requirement: "Packaging Design for Recyclability Certification",
            deadline: "December 2025",
            regions: ["Europe"],
            penalties: "Market access restrictions and fines up to 2% of annual revenue"
          }
        ]
      })
    }
  }]
};

const mockAnalysisData = {
  choices: [{
    message: {
      content: JSON.stringify({
        strategicOverview: {
          title: "Strategic Market Overview",
          description: "High-level synthesis of trends and regulatory landscape for the personal care and beauty packaging sector"
        },
        marketOpportunities: [
          {
            opportunity: "Premium Sustainable Packaging Leadership",
            description: "Opportunity to lead the market in luxury sustainable packaging solutions",
            trendDrivers: ["Consumer demand for premium eco-friendly products", "Regulatory push for sustainability"],
            regulatorySupport: "New regulations favor companies with advanced sustainable packaging",
            timeToMarket: "12-18 months",
            investmentRequired: "Medium to High"
          }
        ],
        riskFactors: [
          {
            risk: "Regulatory Compliance Delays",
            description: "Risk of falling behind on evolving packaging regulations",
            probability: "Medium",
            impact: "High",
            mitigation: "Establish dedicated regulatory monitoring and compliance team"
          }
        ],
        actionableInsights: [
          {
            insight: "Immediate Regulatory Assessment",
            description: "Conduct comprehensive audit of current packaging against upcoming regulations",
            priority: "Immediate",
            expectedOutcome: "Clear roadmap for compliance and competitive advantage"
          }
        ],
        competitiveAdvantage: [
          {
            advantage: "Early Adoption of Circular Packaging",
            description: "First-mover advantage in implementing circular economy principles",
            implementation: "Partner with recycling infrastructure providers and invest in design-for-circularity"
          }
        ]
      })
    }
  }]
};

// Check if backend is available
const isBackendAvailable = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('Backend not available, using mock data');
    return false;
  }
};

export const trendsRegulationsService = {
  // Get industry trends data
  async getTrends(industry: string, companyName?: string) {
    try {
      const backendAvailable = await isBackendAvailable();
      
      if (!backendAvailable) {
        console.log('Using mock trends data');
        return mockTrendsData;
      }

      const response = await fetch(`${API_BASE_URL}/api/trends-regulations/trends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          companyName: companyName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trends data, falling back to mock:', error);
      return mockTrendsData;
    }
  },

  // Get regulations data
  async getRegulations(industry: string, region?: string, companyName?: string) {
    try {
      const backendAvailable = await isBackendAvailable();
      
      if (!backendAvailable) {
        console.log('Using mock regulations data');
        return mockRegulationsData;
      }

      const response = await fetch(`${API_BASE_URL}/api/trends-regulations/regulations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          region: region || undefined,
          companyName: companyName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching regulations data, falling back to mock:', error);
      return mockRegulationsData;
    }
  },

  // Get combined analysis
  async getCombinedAnalysis(industry: string, region?: string, companyName?: string) {
    try {
      const backendAvailable = await isBackendAvailable();
      
      if (!backendAvailable) {
        console.log('Using mock analysis data');
        return mockAnalysisData;
      }

      const response = await fetch(`${API_BASE_URL}/api/trends-regulations/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry,
          region: region || undefined,
          companyName: companyName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching analysis data, falling back to mock:', error);
      return mockAnalysisData;
    }
  }
};

export default trendsRegulationsService;
