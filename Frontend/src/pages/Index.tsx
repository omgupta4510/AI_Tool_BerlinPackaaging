import { useState, useEffect } from 'react';
import { CompanySearch } from '@/components/CompanySearch';
import { TabNavigation } from '@/components/TabNavigation';
import { CompanyProfile } from '@/components/CompanyProfile';
import { NewsSection } from '@/components/NewsSection';
import { SustainabilityOverview } from '@/components/SustainabilityOverview';
import TrendsRegulations from '@/components/TrendsRegulations';
import CommercialStrategy from '@/components/CommercialStrategy';
import ProductAnalysis from '@/components/ProductAnalysis';
import { CompanyData } from '@/types/company';
import CompanyDataService, { isBackendConfigured, getBackendStatus } from '@/services/companyDataService';
import { CompanySearchService, FindCompanyResponse } from '@/services/companySearchService';
import { trendsRegulationsService } from '@/services/trendsRegulationsService';
import CommercialStrategyService from '@/services/commercialStrategyService';
import ProductsService from '@/services/productsService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [backendStatus, setBackendStatus] = useState<boolean | null>(null);
  const [sustainabilityData, setSustainabilityData] = useState<any>(null);
  const [loadingSustainability, setLoadingSustainability] = useState(false);
  const [hasLoadedSustainability, setHasLoadedSustainability] = useState(false);
  
  // Trends & Regulations data
  const [trendsData, setTrendsData] = useState<any>(null);
  const [regulationsData, setRegulationsData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loadingTrends, setLoadingTrends] = useState(false);
  const [hasLoadedTrends, setHasLoadedTrends] = useState(false);
  
  // Commercial Strategy data
  const [salesPlayData, setSalesPlayData] = useState<any>(null);
  const [winningMessageData, setWinningMessageData] = useState<any>(null);
  const [loadingStrategy, setLoadingStrategy] = useState(false);
  const [loadingWinningMessage, setLoadingWinningMessage] = useState(false);
  const [hasLoadedStrategy, setHasLoadedStrategy] = useState(false);
  const [hasLoadedWinningMessage, setHasLoadedWinningMessage] = useState(false);
  
  // Products data
  const [productsData, setProductsData] = useState<any>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [hasLoadedProducts, setHasLoadedProducts] = useState(false);
  
  const [hasSearched, setHasSearched] = useState(false);
  // State for MongoDB integration
  const [companyInfo, setCompanyInfo] = useState<FindCompanyResponse | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Check backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const status = await getBackendStatus();
      setBackendStatus(status);
    };
    checkBackend();
  }, []);

  const handleSearch = async (companyName: string, existingCompanyData?: FindCompanyResponse) => {
    setIsSearching(true);
    setHasSearched(true);
    setSearchQuery(companyName);
    
    // Reset all cached data when searching for a new company
    setSustainabilityData(null);
    setHasLoadedSustainability(false);
    setTrendsData(null);
    setRegulationsData(null);
    setAnalysisData(null);
    setHasLoadedTrends(false);
    setSalesPlayData(null);
    setWinningMessageData(null);
    setHasLoadedStrategy(false);
    setHasLoadedWinningMessage(false);
    setProductsData(null);
    setHasLoadedProducts(false);
    
    try {
      // First, find or create the company in our database
      let companyData = existingCompanyData;
      if (!companyData) {
        companyData = await CompanySearchService.findOrCreateCompany(companyName);
      }
      
      setCompanyInfo(companyData);
      setCurrentCompanyId(companyData.company.id);

      // Check if we have cached data that's still fresh
      const dataStatus = companyData.dataStatus;
      console.log('Data status for', companyName, ':', dataStatus);

      // Always use CompanyDataService to ensure consistent data transformation
      // It will internally decide whether to use cached or fresh data
      console.log('Fetching company data via CompanyDataService for', companyName);
      const company = await CompanyDataService.fetchCompanyData(companyName);
      
      if (company) {
        setSelectedCompany(company);
        
        // Save fresh data to database if it was newly generated
        if (company.dataSource === 'perplexity' && currentCompanyId) {
          try {
            await CompanySearchService.saveAnalysisData(currentCompanyId, 'basic', company);
            console.log('Saved fresh basic company data to database for', companyName);
          } catch (saveError) {
            console.warn('Failed to save basic company data to database:', saveError);
          }
        }
        
        toast({
          title: "Company found!",
          description: `Successfully loaded data for ${company.basicInfo?.name || companyName} (${company.dataSource})`,
        });
      } else {
        setSelectedCompany(null);
        
        toast({
          title: "Company not found",
          description: `No data available for "${companyName}". Please try another company name.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Helper function to detect industry (moved from TrendsRegulations component)
  const getIndustryFromCompany = (company: CompanyData): string => {
    const businessDescription = company.basicInfo.description?.toLowerCase() || '';
    const industry = company.basicInfo.industry?.toLowerCase() || '';
    
    // Industry mapping logic
    if (industry.includes('beauty') || industry.includes('cosmetics') || 
        businessDescription.includes('beauty') || businessDescription.includes('cosmetics') || 
        businessDescription.includes('skincare') || businessDescription.includes('makeup')) {
      return 'Personal Care & Beauty';
    }
    if (industry.includes('food') || industry.includes('beverage') || 
        businessDescription.includes('food') || businessDescription.includes('beverage')) {
      return 'Food & Beverage';
    }
    if (industry.includes('pharmaceutical') || industry.includes('healthcare') || 
        businessDescription.includes('pharmaceutical') || businessDescription.includes('drug')) {
      return 'Pharmaceuticals';
    }
    if (industry.includes('technology') || industry.includes('software') || 
        businessDescription.includes('technology') || businessDescription.includes('software')) {
      return 'Technology';
    }
    if (industry.includes('automotive') || businessDescription.includes('automotive') || 
        businessDescription.includes('vehicle')) {
      return 'Automotive';
    }
    
    // Default fallback
    return company.basicInfo.industry || 'General Industry';
  };

  // Handler functions for generating data
  const handleGenerateSustainability = async () => {
    if (!selectedCompany) return;
    
    // Get the company ID for cache lookup
    let currentCompanyId = null;
    try {
      const companySearchResult = await CompanySearchService.findOrCreateCompany(selectedCompany.basicInfo.name);
      currentCompanyId = companySearchResult?.company?.id;
    } catch (error) {
      console.warn('Failed to get company ID for cache lookup:', error);
    }
    
    setLoadingSustainability(true);
    try {
      let data = null;
      
      // Check MongoDB cache first if we have company ID
      if (currentCompanyId) {
        try {
          const cachedData = await CompanySearchService.getAnalysisData(currentCompanyId, 'competitive');
          if (cachedData?.data) {
            console.log('Using cached sustainability data from MongoDB');
            data = cachedData.data;
          }
        } catch (cacheError) {
          console.log('No cached sustainability data found, fetching fresh data');
        }
      }
      
      // If no cached data, fetch fresh data
      if (!data) {
        console.log('Fetching fresh sustainability data from AI');
        data = await CompanyDataService.fetchSustainabilityData(selectedCompany.basicInfo.name);
        
        // Save fresh data to MongoDB if we have company ID
        if (data && currentCompanyId) {
          try {
            await CompanySearchService.saveAnalysisData(currentCompanyId, 'competitive', data);
            console.log('Saved fresh sustainability data to MongoDB');
          } catch (saveError) {
            console.warn('Failed to save sustainability data to MongoDB:', saveError);
          }
        }
      }
      
      setSustainabilityData(data);
      setHasLoadedSustainability(true);
      
      toast({
        title: "Sustainability data generated",
        description: "Successfully generated sustainability analysis.",
      });
    } catch (error) {
      console.error('Error loading sustainability data:', error);
      toast({
        title: "Failed to generate sustainability data",
        description: "There was an error generating sustainability information.",
        variant: "destructive",
      });
    } finally {
      setLoadingSustainability(false);
    }
  };

  const handleGenerateTrends = async () => {
    if (!selectedCompany) return;
    
    // Get the company ID for cache lookup
    let currentCompanyId = null;
    try {
      const companySearchResult = await CompanySearchService.findOrCreateCompany(selectedCompany.basicInfo.name);
      currentCompanyId = companySearchResult?.company?.id;
    } catch (error) {
      console.warn('Failed to get company ID for cache lookup:', error);
    }
    
    setLoadingTrends(true);
    try {
      let data = null;
      
      // Check MongoDB cache first if we have company ID
      if (currentCompanyId) {
        try {
          const cachedData = await CompanySearchService.getAnalysisData(currentCompanyId, 'trends');
          if (cachedData?.data) {
            console.log('Using cached trends data from MongoDB');
            data = cachedData.data;
          }
        } catch (cacheError) {
          console.log('No cached trends data found, fetching fresh data');
        }
      }
      
      // If no cached data, fetch fresh data
      if (!data) {
        console.log('Fetching fresh trends data from AI');
        const detectedIndustry = getIndustryFromCompany(selectedCompany);
        data = await trendsRegulationsService.getTrends(detectedIndustry, selectedCompany.basicInfo.name);
        
        // Save fresh data to MongoDB if we have company ID
        if (data && currentCompanyId) {
          try {
            await CompanySearchService.saveAnalysisData(currentCompanyId, 'trends', data);
            console.log('Saved fresh trends data to MongoDB');
          } catch (saveError) {
            console.warn('Failed to save trends data to MongoDB:', saveError);
          }
        }
      }
      
      setTrendsData(data);
      setHasLoadedTrends(true);
      
      toast({
        title: "Trends data generated",
        description: "Successfully generated industry trends analysis.",
      });
    } catch (error) {
      console.error('Error loading trends data:', error);
      toast({
        title: "Failed to generate trends data",
        description: "There was an error generating industry trends information.",
        variant: "destructive",
      });
    } finally {
      setLoadingTrends(false);
    }
  };

  const handleGenerateStrategy = async () => {
    if (!selectedCompany) return;
    
    // Get the company ID for cache lookup
    let currentCompanyId = null;
    try {
      const companySearchResult = await CompanySearchService.findOrCreateCompany(selectedCompany.basicInfo.name);
      currentCompanyId = companySearchResult?.company?.id;
    } catch (error) {
      console.warn('Failed to get company ID for cache lookup:', error);
    }
    
    setLoadingStrategy(true);
    try {
      let data = null;
      
      // Check MongoDB cache first if we have company ID
      if (currentCompanyId) {
        try {
          const cachedData = await CompanySearchService.getAnalysisData(currentCompanyId, 'commercial');
          if (cachedData?.data) {
            console.log('Using cached commercial strategy data from MongoDB');
            data = cachedData.data;
          }
        } catch (cacheError) {
          console.log('No cached commercial strategy data found, fetching fresh data');
        }
      }
      
      // If no cached data, fetch fresh data
      if (!data) {
        console.log('Fetching fresh commercial strategy data from AI');
        data = await CommercialStrategyService.fetchSalesPlay(selectedCompany.basicInfo.name);
        
        // Save fresh data to MongoDB if we have company ID
        if (data && currentCompanyId) {
          try {
            await CompanySearchService.saveAnalysisData(currentCompanyId, 'commercial', data);
            console.log('Saved fresh commercial strategy data to MongoDB');
          } catch (saveError) {
            console.warn('Failed to save commercial strategy data to MongoDB:', saveError);
          }
        }
      }
      
      setSalesPlayData(data);
      setHasLoadedStrategy(true);
      
      toast({
        title: "Strategy data generated",
        description: "Successfully generated commercial strategy analysis.",
      });
    } catch (error) {
      console.error('Error loading strategy data:', error);
      toast({
        title: "Failed to generate strategy data",
        description: "There was an error generating commercial strategy information.",
        variant: "destructive",
      });
    } finally {
      setLoadingStrategy(false);
    }
  };

  const handleGenerateWinningMessage = async () => {
    if (!selectedCompany) return;
    
    setLoadingWinningMessage(true);
    try {
      const data = await CommercialStrategyService.fetchWinningMessage(selectedCompany.basicInfo.name);
      setWinningMessageData(data);
      setHasLoadedWinningMessage(true);
      
      toast({
        title: "Winning message generated",
        description: "Successfully generated winning message analysis.",
      });
    } catch (error) {
      console.error('Error loading winning message data:', error);
      toast({
        title: "Failed to generate winning message",
        description: "There was an error generating winning message information.",
        variant: "destructive",
      });
    } finally {
      setLoadingWinningMessage(false);
    }
  };

  const handleGenerateProducts = async () => {
    if (!selectedCompany) return;
    
    // Get the company ID for cache lookup
    let currentCompanyId = null;
    try {
      const companySearchResult = await CompanySearchService.findOrCreateCompany(selectedCompany.basicInfo.name);
      currentCompanyId = companySearchResult?.company?.id;
    } catch (error) {
      console.warn('Failed to get company ID for cache lookup:', error);
    }
    
    setLoadingProducts(true);
    try {
      let data = null;
      
      // Check MongoDB cache first if we have company ID
      if (currentCompanyId) {
        try {
          const cachedData = await CompanySearchService.getAnalysisData(currentCompanyId, 'products');
          if (cachedData?.data) {
            console.log('Using cached products analysis data from MongoDB');
            data = cachedData.data;
          }
        } catch (cacheError) {
          console.log('No cached products analysis data found, fetching fresh data');
        }
      }
      
      // If no cached data, fetch fresh data
      if (!data) {
        console.log('Fetching fresh products analysis data from AI');
        data = await ProductsService.fetchProductAnalysis(selectedCompany.basicInfo.name);
        
        // Save fresh data to MongoDB if we have company ID
        if (data && currentCompanyId) {
          try {
            await CompanySearchService.saveAnalysisData(currentCompanyId, 'products', data);
            console.log('Saved fresh products analysis data to MongoDB');
          } catch (saveError) {
            console.warn('Failed to save products analysis data to MongoDB:', saveError);
          }
        }
      }
      
      setProductsData(data);
      setHasLoadedProducts(true);
      
      toast({
        title: "Products data generated",
        description: "Successfully generated products and packaging analysis.",
      });
    } catch (error) {
      console.error('Error loading products data:', error);
      toast({
        title: "Failed to generate products data",
        description: "There was an error generating products and packaging information.",
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handler functions for refreshing data
  const handleRefreshTrends = async () => {
    if (!selectedCompany) return;
    
    setLoadingTrends(true);
    try {
      const detectedIndustry = getIndustryFromCompany(selectedCompany);
      const data = await trendsRegulationsService.getTrends(detectedIndustry, selectedCompany.basicInfo.name);
      setTrendsData(data);
    } catch (error) {
      console.error('Error refreshing trends data:', error);
      toast({
        title: "Failed to refresh trends data",
        description: "There was an error refreshing industry trends information.",
        variant: "destructive",
      });
    } finally {
      setLoadingTrends(false);
    }
  };

  const handleRefreshRegulations = async () => {
    if (!selectedCompany) return;
    
    setLoadingTrends(true);
    try {
      const detectedIndustry = getIndustryFromCompany(selectedCompany);
      const region = selectedCompany.basicInfo.headquarters?.includes('Europe') ? 'Europe' : 
                    selectedCompany.basicInfo.headquarters?.includes('US') || selectedCompany.basicInfo.headquarters?.includes('United States') ? 'North America' : 
                    'Global';
      const data = await trendsRegulationsService.getRegulations(detectedIndustry, region, selectedCompany.basicInfo.name);
      setRegulationsData(data);
    } catch (error) {
      console.error('Error refreshing regulations data:', error);
      toast({
        title: "Failed to refresh regulations data",
        description: "There was an error refreshing regulations information.",
        variant: "destructive",
      });
    } finally {
      setLoadingTrends(false);
    }
  };

  const handleRefreshAnalysis = async () => {
    if (!selectedCompany) return;
    
    setLoadingTrends(true);
    try {
      const detectedIndustry = getIndustryFromCompany(selectedCompany);
      const region = selectedCompany.basicInfo.headquarters?.includes('Europe') ? 'Europe' : 
                    selectedCompany.basicInfo.headquarters?.includes('US') || selectedCompany.basicInfo.headquarters?.includes('United States') ? 'North America' : 
                    'Global';
      const data = await trendsRegulationsService.getCombinedAnalysis(detectedIndustry, region, selectedCompany.basicInfo.name);
      setAnalysisData(data);
    } catch (error) {
      console.error('Error refreshing analysis data:', error);
      toast({
        title: "Failed to refresh analysis data",
        description: "There was an error refreshing strategic analysis information.",
        variant: "destructive",
      });
    } finally {
      setLoadingTrends(false);
    }
  };

  const handleRefreshStrategy = async () => {
    if (!selectedCompany) return;
    
    setLoadingStrategy(true);
    try {
      const data = await CommercialStrategyService.fetchSalesPlay(selectedCompany.basicInfo.name);
      setSalesPlayData(data);
    } catch (error) {
      console.error('Error refreshing strategy data:', error);
      toast({
        title: "Failed to refresh strategy data",
        description: "There was an error refreshing commercial strategy information.",
        variant: "destructive",
      });
    } finally {
      setLoadingStrategy(false);
    }
  };

  const handleRefreshWinningMessage = async () => {
    if (!selectedCompany) return;
    
    setLoadingWinningMessage(true);
    try {
      const data = await CommercialStrategyService.fetchWinningMessage(selectedCompany.basicInfo.name);
      setWinningMessageData(data);
    } catch (error) {
      console.error('Error refreshing winning message data:', error);
      toast({
        title: "Failed to refresh winning message data",
        description: "There was an error refreshing winning message information.",
        variant: "destructive",
      });
    } finally {
      setLoadingWinningMessage(false);
    }
  };

  const handleRefreshProducts = async () => {
    if (!selectedCompany) return;
    
    // Get the company ID for saving to MongoDB
    let currentCompanyId = null;
    try {
      const companySearchResult = await CompanySearchService.findOrCreateCompany(selectedCompany.basicInfo.name);
      currentCompanyId = companySearchResult?.company?.id;
    } catch (error) {
      console.warn('Failed to get company ID for cache update:', error);
    }
    
    setLoadingProducts(true);
    try {
      console.log('Refreshing products analysis data from AI');
      const data = await ProductsService.fetchProductAnalysis(selectedCompany.basicInfo.name);
      setProductsData(data);
      
      // Save fresh data to MongoDB if we have company ID
      if (data && currentCompanyId) {
        try {
          await CompanySearchService.saveAnalysisData(currentCompanyId, 'products', data);
          console.log('Saved refreshed products analysis data to MongoDB');
        } catch (saveError) {
          console.warn('Failed to save refreshed products analysis data to MongoDB:', saveError);
        }
      }
      
      toast({
        title: "Products data refreshed",
        description: "Successfully refreshed products and packaging analysis.",
      });
    } catch (error) {
      console.error('Error refreshing products data:', error);
      toast({
        title: "Failed to refresh products data",
        description: "There was an error refreshing products and packaging information.",
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const renderTabContent = () => {
    if (!selectedCompany) return null;

    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <CompanyProfile companyData={selectedCompany} />
            <NewsSection articles={selectedCompany.recentNews} companyName={selectedCompany.basicInfo.name} />
          </div>
        );
      case 'products':
        if (!hasLoadedProducts && !loadingProducts) {
          return (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Products & Packaging Analysis
                </h3>
                <p className="text-muted-foreground mb-6">
                  Generate detailed analysis of {selectedCompany.basicInfo.name}'s products and packaging strategies.
                </p>
                <button
                  onClick={handleGenerateProducts}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Generate Products Analysis
                </button>
              </div>
            </div>
          );
        }
        
        return (
          <ProductAnalysis 
            companyName={selectedCompany.basicInfo.name}
            data={productsData}
            loading={loadingProducts}
            error={null}
            onRefresh={hasLoadedProducts ? handleRefreshProducts : handleGenerateProducts}
          />
        );
      case 'sustainability':
        if (!hasLoadedSustainability && !loadingSustainability) {
          return (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Sustainability Analysis
                </h3>
                <p className="text-muted-foreground mb-6">
                  Generate comprehensive sustainability and competitive analysis for {selectedCompany.basicInfo.name}.
                </p>
                <button
                  onClick={handleGenerateSustainability}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Generate Sustainability Analysis
                </button>
              </div>
            </div>
          );
        }
        
        if (loadingSustainability) {
          return (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Loading Sustainability Data...
                </h3>
                <p className="text-muted-foreground">
                  Fetching sustainability information from AI analysis.
                </p>
              </div>
            </div>
          );
        }
        
        return sustainabilityData ? (
          <SustainabilityOverview 
            sustainabilityData={sustainabilityData} 
            companyName={selectedCompany.basicInfo.name}
          />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Sustainability Data Available
              </h3>
              <p className="text-muted-foreground">
                Sustainability information could not be loaded for this company.
              </p>
            </div>
          </div>
        );
      case 'trends':
        if (!hasLoadedTrends && !loadingTrends) {
          return (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Trends & Regulations Analysis
                </h3>
                <p className="text-muted-foreground mb-6">
                  Generate industry trends and regulatory analysis for {selectedCompany.basicInfo.name}.
                </p>
                <button
                  onClick={handleGenerateTrends}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Generate Trends Analysis
                </button>
              </div>
            </div>
          );
        }
        
        return (
          <TrendsRegulations 
            companyData={selectedCompany}
            trendsData={trendsData}
            regulationsData={regulationsData}
            analysisData={analysisData}
            loading={loadingTrends}
            onRefreshTrends={hasLoadedTrends ? handleRefreshTrends : handleGenerateTrends}
            onRefreshRegulations={handleRefreshRegulations}
            onRefreshAnalysis={handleRefreshAnalysis}
          />
        );
      case 'strategy':
        if (!hasLoadedStrategy && !loadingStrategy && !hasLoadedWinningMessage && !loadingWinningMessage) {
          return (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded"></div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Commercial Strategy Analysis
                </h3>
                <p className="text-muted-foreground mb-6">
                  Generate sales strategy and winning message analysis for {selectedCompany.basicInfo.name}.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleGenerateStrategy}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors block w-full"
                  >
                    Generate Sales Strategy
                  </button>
                  <button
                    onClick={handleGenerateWinningMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors block w-full"
                  >
                    Generate Winning Message
                  </button>
                </div>
              </div>
            </div>
          );
        }
        
        return (
          <CommercialStrategy 
            companyData={selectedCompany}
            salesPlayData={salesPlayData}
            winningMessageData={winningMessageData}
            loading={loadingStrategy}
            loadingWinningMessage={loadingWinningMessage}
            onRefresh={hasLoadedStrategy ? handleRefreshStrategy : handleGenerateStrategy}
            onRefreshWinningMessage={hasLoadedWinningMessage ? handleRefreshWinningMessage : handleGenerateWinningMessage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Section */}
        <div className="mb-8">
          <CompanySearch onSearch={handleSearch} isLoading={isSearching} />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Tab Navigation */}
            {selectedCompany && (
              <TabNavigation 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />
            )}

            {/* Tab Content */}
            <div>
              {renderTabContent()}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!hasSearched && (
          <div className="text-center mt-16">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-black mb-4">
                Unlock Deep Company Intelligence
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Discover comprehensive insights, market presence, and real-time news for any company. 
                Perfect for sales teams, analysts, and business professionals.
              </p>
              <div className="bg-white rounded-xl p-6 shadow-medium">
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">Get Started:</p>
                  {!isBackendConfigured() || backendStatus === false ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-yellow-800 text-sm">
                        <strong>Backend Status:</strong> {backendStatus === false ? 'Backend server not responding.' : 'Backend not configured.'} Using demo data with realistic company profiles.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <p className="text-green-800 text-sm">
                        <strong>Live Data Ready!</strong> Backend connected to Perplexity AI. Search for any company to get real-time intelligence data.
                      </p>
                    </div>
                  )}
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;