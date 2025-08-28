export interface CompanySearchResult {
  id: string;
  name: string;
  industry?: string;
  description?: string;
  logo?: string;
  similarity: number;
  searchCount: number;
}

export interface CompanyDataStatus {
  basic: {
    exists: boolean;
    lastUpdated: string | null;
    hoursOld: number | null;
    isStale: boolean;
    dataVersion: string | null;
  };
  products: {
    exists: boolean;
    lastUpdated: string | null;
    hoursOld: number | null;
    isStale: boolean;
    dataVersion: string | null;
  };
  competitive: {
    exists: boolean;
    lastUpdated: string | null;
    hoursOld: number | null;
    isStale: boolean;
    dataVersion: string | null;
  };
  trends: {
    exists: boolean;
    lastUpdated: string | null;
    hoursOld: number | null;
    isStale: boolean;
    dataVersion: string | null;
  };
  commercial: {
    exists: boolean;
    lastUpdated: string | null;
    hoursOld: number | null;
    isStale: boolean;
    dataVersion: string | null;
  };
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  description?: string;
  logo?: string;
  website?: string;
  searchCount: number;
}

export interface FindCompanyResponse {
  company: Company;
  dataStatus: CompanyDataStatus;
  isNewCompany: boolean;
}

export class CompanySearchService {
  private static baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  /**
   * Search for companies by name
   */
  public static async searchCompanies(query: string): Promise<CompanySearchResult[]> {
    try {
      console.log(`[CompanySearchService] Searching for: "${query}"`);
      console.log(`[CompanySearchService] Base URL: ${this.baseUrl}`);
      
      if (!query || query.trim().length < 2) {
        console.log('[CompanySearchService] Query too short, returning empty results');
        return [];
      }

      const url = `${this.baseUrl}/api/companies/search`;
      console.log(`[CompanySearchService] Making request to: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      console.log(`[CompanySearchService] Response status: ${response.status}`);

      if (!response.ok) {
        console.error(`[CompanySearchService] Search failed: ${response.status}`);
        throw new Error(`Search failed: ${response.status}`);
      }

      const result = await response.json();
      console.log(`[CompanySearchService] Search results:`, result);
      return result.results || [];
    } catch (error) {
      console.error('[CompanySearchService] Company search error:', error);
      return this.getFallbackResults(query);
    }
  }

  /**
   * Find or create a company
   */
  public static async findOrCreateCompany(companyName: string): Promise<FindCompanyResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/find-or-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName: companyName.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to find/create company: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Find/create company error:', error);
      throw error;
    }
  }

  /**
   * Get analysis data for a company
   */
  public static async getAnalysisData(companyId: string, analysisType: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/${companyId}/analysis/${analysisType}`);

      if (response.status === 404) {
        return null; // No data found
      }

      if (!response.ok) {
        throw new Error(`Failed to get analysis data: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Get ${analysisType} analysis error:`, error);
      throw error;
    }
  }

  /**
   * Save analysis data for a company
   */
  public static async saveAnalysisData(companyId: string, analysisType: string, data: any, generationTime?: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/${companyId}/analysis/${analysisType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, generationTime }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save analysis data: ${response.status}`);
      }
    } catch (error) {
      console.error(`Save ${analysisType} analysis error:`, error);
      throw error;
    }
  }

  /**
   * Check company data status
   */
  public static async getCompanyStatus(companyId: string): Promise<{ dataStatus: CompanyDataStatus }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/${companyId}/status`);

      if (!response.ok) {
        throw new Error(`Failed to get company status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get company status error:', error);
      throw error;
    }
  }

  /**
   * Update company information
   */
  public static async updateCompany(companyId: string, updateData: Partial<Company>): Promise<Company> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update company: ${response.status}`);
      }

      const result = await response.json();
      return result.company;
    } catch (error) {
      console.error('Update company error:', error);
      throw error;
    }
  }

  /**
   * Get popular companies
   */
  public static async getPopularCompanies(): Promise<CompanySearchResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/popular`);

      if (!response.ok) {
        throw new Error(`Failed to get popular companies: ${response.status}`);
      }

      const result = await response.json();
      return result.companies.map((company: any) => ({
        ...company,
        similarity: 1.0 // Popular companies have perfect similarity
      }));
    } catch (error) {
      console.error('Get popular companies error:', error);
      return [];
    }
  }

  /**
   * Enhanced company data fetch with database integration
   */
  public static async fetchCompanyData(companyName: string, forceRefresh = false): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/company-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          companyName: companyName.trim(),
          forceRefresh 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch company data: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch company data error:', error);
      throw error;
    }
  }

  /**
   * Fallback results for offline or error scenarios
   */
  private static getFallbackResults(query: string): CompanySearchResult[] {
    const mockCompanies = [
      { id: '1', name: 'Microsoft', industry: 'Technology', description: 'Software and cloud services' },
      { id: '2', name: 'Apple', industry: 'Technology', description: 'Consumer electronics' },
      { id: '3', name: 'Tesla', industry: 'Automotive', description: 'Electric vehicles' },
      { id: '4', name: 'Amazon', industry: 'E-commerce', description: 'Online retail and cloud services' },
      { id: '5', name: 'Google', industry: 'Technology', description: 'Search and advertising' },
      { id: '6', name: 'Procter & Gamble', industry: 'Consumer Goods', description: 'Consumer products' },
      { id: '7', name: 'Unilever', industry: 'Consumer Goods', description: 'Consumer goods' },
      { id: '8', name: 'Coca-Cola', industry: 'Beverages', description: 'Soft drinks and beverages' }
    ];

    const queryLower = query.toLowerCase();
    return mockCompanies
      .filter(company => 
        company.name.toLowerCase().includes(queryLower) ||
        company.industry.toLowerCase().includes(queryLower)
      )
      .map(company => ({ 
        ...company, 
        similarity: 0.8,
        searchCount: Math.floor(Math.random() * 100) + 1
      }))
      .slice(0, 5);
  }

  /**
   * Health check for the service
   */
  public static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/companies/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}
