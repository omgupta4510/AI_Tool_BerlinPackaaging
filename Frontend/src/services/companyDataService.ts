import { CompanyData, PerplexityCompanyResponse, CommercialData, SustainabilityData } from '@/types/company';
import { searchMockCompany } from './mockDataService';
import { CompanySearchService } from './companySearchService';

// Backend API configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Cache for storing fetched company data
const companyCache = new Map<string, { data: CompanyData; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class CompanyDataService {
  private static generateMockCommercialData(): CommercialData {
    const statuses: CommercialData['status'][] = ['Prospect', 'Existing Client', 'Lost Client', 'Not Qualified'];
    const managers = ['Sarah Johnson', 'Michael Chen', 'Emma Wilson', 'David Rodriguez', 'Lisa Thompson'];
    
    return {
      status: statuses[Math.floor(Math.random() * statuses.length)],
      accountManager: managers[Math.floor(Math.random() * managers.length)],
      annualPotentialRevenue: `$${(Math.random() * 50 + 10).toFixed(1)}M`,
      salesGrowthPotential: `${(Math.random() * 30 + 10).toFixed(0)}%`,
      contractDetails: {
        duration: '3 years',
        totalPotential: `$${(Math.random() * 150 + 50).toFixed(1)}M`,
        renewalDate: '2025-12-31'
      }
    };
  }

  private static createPrompt(companyName: string): string {
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

  public static async fetchCompanyData(companyName: string): Promise<CompanyData> {
    // Check local cache first
    const cacheKey = companyName.toLowerCase();
    const cached = companyCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Using local cached data for ${companyName}`);
      return cached.data;
    }

    // Check MongoDB database for company and analysis data
    try {
      console.log(`Checking MongoDB for existing data for ${companyName}`);
      const companySearchResult = await CompanySearchService.findOrCreateCompany(companyName);
      
      if (companySearchResult?.company) {
        const companyId = companySearchResult.company.id;
        const dataStatus = companySearchResult.dataStatus;
        
        // Check if we have fresh basic company data in MongoDB
        if (dataStatus.basic?.exists && !dataStatus.basic?.isStale) {
          console.log(`Found fresh MongoDB basic company data for ${companyName}`);
          
          try {
            const cachedAnalysis = await CompanySearchService.getAnalysisData(companyId, 'basic');
            if (cachedAnalysis?.data) {
              // Transform MongoDB cached data to our CompanyData format
              const companyData: CompanyData = {
                basicInfo: cachedAnalysis.data.basicInfo,
                employees: cachedAnalysis.data.employees,
                productCategories: cachedAnalysis.data.productCategories || [],
                globalPresence: cachedAnalysis.data.globalPresence || [],
                recentNews: (cachedAnalysis.data.recentNews || []).map((news: any, index: number) => ({
                  id: `cached-${index}`,
                  headline: news.headline,
                  date: news.date,
                  summary: news.summary,
                  source: news.source,
                  sourceUrl: '#'
                })),
                financialData: cachedAnalysis.data.financialData,
                commercialData: cachedAnalysis.data.commercialData || this.generateMockCommercialData(),
                keyContacts: cachedAnalysis.data.keyContacts || [],
                lastUpdated: dataStatus.basic?.lastUpdated || new Date().toISOString(),
                dataSource: 'cached' as const
              };
              
              // Also cache locally
              companyCache.set(cacheKey, {
                data: companyData,
                timestamp: Date.now()
              });
              
              console.log(`Successfully loaded cached MongoDB basic company data for ${companyName}`);
              return companyData;
            }
          } catch (cacheError) {
            console.warn('Failed to load cached data from MongoDB:', cacheError);
          }
        }
      }
    } catch (mongoError) {
      console.warn('MongoDB check failed, proceeding with fresh data:', mongoError);
    }

    // If no cached data available, fetch fresh data

    // If no cached data available, fetch fresh data
    console.log(`No cached data found, generating fresh data for ${companyName}`);

    // Check if backend is available and API key is configured
    if (!isBackendConfigured()) {
      console.log(`Backend not configured, using mock data for ${companyName}`);
      return await this.getFallbackData(companyName);
    }

    try {
      console.log(`Fetching fresh data for ${companyName} from backend (Perplexity)...`);
      
      // Call our backend API instead of Perplexity directly
      const response = await fetch(`${BACKEND_URL}/api/company-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Backend API error: ${response.status}`, errorData);
        throw new Error(`Backend API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const completion = await response.json();
      console.log('Backend response:', { 
        cached: completion.cached, 
        hasChoices: !!completion.choices, 
        lastUpdated: completion.lastUpdated 
      });
      
      const responseText = completion.choices[0]?.message?.content;
      
      if (!responseText) {
        throw new Error('No response content from backend');
      }

      let parsedData: PerplexityCompanyResponse;

      // Try to parse the response - it might already be a JSON object or a JSON string
      try {
        if (typeof responseText === 'string') {
          // Extract JSON from markdown code blocks if present
          let jsonString = responseText;
          const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonString = jsonMatch[1];
          } else {
            // Try to find JSON object directly
            const directJsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (directJsonMatch) {
              jsonString = directJsonMatch[0];
            }
          }
          parsedData = JSON.parse(jsonString);
        } else {
          // Data is already parsed (from cached response)
          parsedData = responseText;
        }
      } catch (parseError) {
        console.error('Failed to parse response data:', parseError);
        console.error('Raw response text:', responseText);
        throw new Error('Failed to parse company data from backend response');
      }
      
      // Transform to our internal format
      const companyData: CompanyData = {
        basicInfo: parsedData.basicInfo,
        employees: parsedData.employees,
        productCategories: parsedData.productCategories || [],
        globalPresence: parsedData.globalPresence || [],
        recentNews: (parsedData.recentNews || []).map((news, index) => ({
          id: `ai-${index}`,
          headline: news.headline,
          date: news.date,
          summary: news.summary,
          source: news.source,
          sourceUrl: '#'
        })),
        financialData: parsedData.financialData,
        commercialData: this.generateMockCommercialData(),
        keyContacts: parsedData.keyContacts || [],
        lastUpdated: completion.lastUpdated || new Date().toISOString(),
        dataSource: completion.cached ? 'cached' : 'perplexity'
      };

      // Cache the result
      companyCache.set(cacheKey, {
        data: companyData,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched and cached data for ${companyName}`);
      return companyData;

    } catch (error) {
      console.error('Error fetching company data from backend:', error);
      
      // Fallback to mock data if backend fails
      console.log(`Backend failed, falling back to mock data for ${companyName}`);
      return await this.getFallbackData(companyName);
    }
  }

  private static async getFallbackData(companyName: string): Promise<CompanyData> {
    const mockData = await searchMockCompany(companyName);
    if (mockData) {
      const enhancedMockData = {
        ...mockData,
        dataSource: 'mock' as const,
        lastUpdated: new Date().toISOString()
      };
      
      companyCache.set(companyName.toLowerCase(), {
        data: enhancedMockData,
        timestamp: Date.now()
      });
      return enhancedMockData;
    }
    throw new Error(`No data available for ${companyName}`);
  }

  public static clearCache(): void {
    companyCache.clear();
  }

  public static getCacheStats(): { size: number; keys: string[] } {
    return {
      size: companyCache.size,
      keys: Array.from(companyCache.keys())
    };
  }

  // New method to fetch sustainability data
  public static async fetchSustainabilityData(companyName: string): Promise<SustainabilityData | null> {
    try {
      // Check if backend is configured and available
      if (!isBackendConfigured()) {
        console.log('Backend not configured, falling back to mock data');
        const mockData = await searchMockCompany(companyName);
        return mockData?.sustainabilityData || null;
      }

      const response = await fetch(`${BACKEND_URL}/api/sustainability-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      
      // Parse the AI response content
      const content = result.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content in Perplexity API response');
      }

      try {
        // Try to parse the JSON from the AI response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No valid JSON found in response');
        }

        const sustainabilityData = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed sustainability data from Perplexity AI');
        return sustainabilityData;
      } catch (parseError) {
        console.error('Failed to parse sustainability data JSON:', parseError);
        console.log('Raw content:', content);
        return null;
      }
    } catch (error) {
      console.error('Error fetching sustainability data:', error);
      
      // Fallback to mock data
      console.log('Falling back to mock sustainability data');
      const mockData = await searchMockCompany(companyName);
      return mockData?.sustainabilityData || null;
    }
  }
}

// Helper functions to check configuration


export const isBackendConfigured = (): boolean => {
  return !!BACKEND_URL;
};

export const getBackendStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
};

// Export the service instance
export default CompanyDataService;
