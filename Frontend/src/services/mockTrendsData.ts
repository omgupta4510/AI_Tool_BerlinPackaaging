// Mock data for trends and regulations when backend is not available
export const mockTrendsData = {
  choices: [{
    message: {
      content: JSON.stringify({
        industryTrendsSummary: {
          title: "Industry Trends Summary",
          description: "Critical market dynamics and opportunities for personal care & beauty packaging",
          marketReality: "The Personal Care & Beauty industry is experiencing significant pressure to adopt sustainable packaging solutions, with Premium Lifestyle & Wellness companies facing unique regulatory and consumer-driven challenges that require immediate strategic attention."
        },
        salesOpportunities: [
          {
            title: "Implementing sustainable packaging solutions to meet evolving regulatory requirements",
            description: "Growing demand for eco-friendly packaging materials and design-for-recycling approaches",
            priority: "High"
          },
          {
            title: "Developing cost-effective lightweight packaging alternatives",
            description: "Market opportunity for innovative materials that reduce shipping costs while maintaining product protection",
            priority: "Medium"
          }
        ],
        urgencyFactors: [
          {
            title: "New EU packaging regulations creating compliance deadlines",
            description: "Immediate action required for companies selling in European markets",
            impact: "High"
          },
          {
            title: "Growing consumer demand for sustainable packaging",
            description: "Brand reputation risk for companies not adapting to sustainability expectations",
            impact: "Medium"
          }
        ],
        keyTrends: [
          {
            title: "Circular Economy Integration in Personal Care & Beauty",
            description: "Companies implementing circular packaging models to reduce waste and improve resource efficiency",
            priority: "Critical",
            timeframe: "Current",
            marketImpact: "Leading brands are investing in closed-loop packaging systems and extended producer responsibility programs"
          },
          {
            title: "Material Innovation for Premium Products",
            description: "Development of next-generation sustainable materials that meet luxury brand requirements",
            priority: "High",
            timeframe: "6 months",
            marketImpact: "New materials offering improved functionality while meeting sustainability standards"
          }
        ],
        latestNews: [
          {
            title: "New Packaging Regulations Impact Personal Care & Beauty Companies",
            description: "Recent regulatory updates introduce stricter requirements for packaging recyclability and material content",
            date: "November 2024",
            source: "European Packaging Authority",
            relevance: "Directly affects Premium Lifestyle & Wellness companies' packaging strategies"
          }
        ]
      })
    }
  }]
};

export const mockRegulationsData = {
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
                description: "Personal Care & Beauty companies must incorporate minimum percentages of recycled PET content in packaging",
                timeframe: "2025-2030",
                affectedRegions: ["Europe", "North America"],
                complianceRequirements: "Minimum 25% recycled content by 2025, increasing to 50% by 2030",
                priority: "Critical"
              }
            ]
          },
          {
            material: "Mixed Plastics",
            regulations: [
              {
                title: "Mixed Plastic Sorting Requirements for Personal Care & Beauty",
                description: "Enhanced sorting and labeling requirements for mixed plastic packaging",
                timeframe: "2026-2030",
                affectedRegions: ["Europe", "Asia-Pacific"],
                complianceRequirements: "Clear labeling and design for recyclability standards",
                priority: "High"
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

export const mockAnalysisData = {
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
