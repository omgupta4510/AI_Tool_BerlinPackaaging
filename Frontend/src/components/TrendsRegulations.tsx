import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { AlertCircle, TrendingUp, Scale, Target, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { CompanyData } from '../types/company';
import { trendsRegulationsService } from '../services/trendsRegulationsService';

interface TrendsRegulationsProps {
  companyData: CompanyData;
  trendsData?: any;
  regulationsData?: any;
  analysisData?: any;
  loading?: boolean;
  onRefreshTrends?: () => Promise<void>;
  onRefreshRegulations?: () => Promise<void>;
  onRefreshAnalysis?: () => Promise<void>;
}

const TrendsRegulations = ({ 
  companyData, 
  trendsData: propTrendsData, 
  regulationsData: propRegulationsData, 
  analysisData: propAnalysisData, 
  loading: propLoading = false,
  onRefreshTrends,
  onRefreshRegulations,
  onRefreshAnalysis
}: TrendsRegulationsProps) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('trends');
  
  // Use props data if available, otherwise use local state for backward compatibility
  const [localTrendsData, setLocalTrendsData] = useState<any>(null);
  const [localRegulationsData, setLocalRegulationsData] = useState<any>(null);
  const [localAnalysisData, setLocalAnalysisData] = useState<any>(null);

  const trendsData = propTrendsData || localTrendsData;
  const regulationsData = propRegulationsData || localRegulationsData;
  const analysisData = propAnalysisData || localAnalysisData;
  const loading = propLoading || localLoading;

  // Auto-detect industry based on company data
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

  const companyName = companyData?.basicInfo?.name || 'Unknown Company';
  const detectedIndustry = getIndustryFromCompany(companyData);
  const region = companyData?.basicInfo?.headquarters?.includes('Europe') ? 'Europe' : 
                companyData?.basicInfo?.headquarters?.includes('US') || companyData?.basicInfo?.headquarters?.includes('United States') ? 'North America' : 
                'Global';

  // Auto-fetch trends data when component mounts (only if no data provided via props and no parent handlers)
  useEffect(() => {
    if (!propTrendsData && !onRefreshTrends) {
      handleFetchTrends();
    }
  }, [companyName, detectedIndustry, propTrendsData, onRefreshTrends]);

  const handleFetchTrends = async () => {
    if (onRefreshTrends) {
      await onRefreshTrends();
      return;
    }
    
    setLocalLoading(true);
    setError(null);
    
    try {
      const data = await trendsRegulationsService.getTrends(detectedIndustry, companyName);
      setLocalTrendsData(data);
      setActiveTab('trends');
    } catch (err) {
      setError('Failed to fetch trends data');
      console.error('Error fetching trends:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFetchRegulations = async () => {
    if (onRefreshRegulations) {
      await onRefreshRegulations();
      return;
    }
    
    setLocalLoading(true);
    setError(null);
    
    try {
      const data = await trendsRegulationsService.getRegulations(detectedIndustry, region, companyName);
      setLocalRegulationsData(data);
      setActiveTab('regulations');
    } catch (err) {
      setError('Failed to fetch regulations data');
      console.error('Error fetching regulations:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFetchAnalysis = async () => {
    if (onRefreshAnalysis) {
      await onRefreshAnalysis();
      return;
    }
    
    setLocalLoading(true);
    setError(null);
    
    try {
      const data = await trendsRegulationsService.getCombinedAnalysis(detectedIndustry, region, companyName);
      setLocalAnalysisData(data);
      setActiveTab('analysis');
    } catch (err) {
      setError('Failed to fetch analysis data');
      console.error('Error fetching analysis:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Analysis Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Industry Trends & Regulations Analysis for {companyName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="font-medium text-blue-900">Company: </span>
              <span className="text-blue-800">{companyName}</span>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="font-medium text-green-900">Industry: </span>
              <span className="text-green-800">{detectedIndustry}</span>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="font-medium text-purple-900">Region: </span>
              <span className="text-purple-800">{region}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleFetchTrends} disabled={loading}>
              {loading && activeTab === 'trends' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              {trendsData ? 'Refresh Trends' : 'Get Industry Trends'}
            </Button>
            <Button onClick={handleFetchRegulations} disabled={loading} variant="outline">
              {loading && activeTab === 'regulations' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Scale className="h-4 w-4 mr-2" />
              )}
              {regulationsData ? 'Refresh Regulations' : 'Get Regulations'}
            </Button>
            <Button onClick={handleFetchAnalysis} disabled={loading} variant="secondary">
              {loading && activeTab === 'analysis' ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              {analysisData ? 'Refresh Analysis' : 'Get Strategic Analysis'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Analyzing industry data...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Tabs */}
      {(trendsData || regulationsData || analysisData) && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends" disabled={!trendsData}>Industry Trends</TabsTrigger>
            <TabsTrigger value="regulations" disabled={!regulationsData}>Regulations</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysisData}>Strategic Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {trendsData && <TrendsView data={trendsData} getPriorityColor={getPriorityColor} />}
          </TabsContent>

          <TabsContent value="regulations" className="space-y-6">
            {regulationsData && <RegulationsView data={regulationsData} getPriorityColor={getPriorityColor} />}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {analysisData && <AnalysisView data={analysisData} getPriorityColor={getPriorityColor} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// Trends View Component
const TrendsView = ({ data, getPriorityColor }: { data: any; getPriorityColor: (priority: string) => string }) => {
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    let trendsInfo;
    if (parsedData.choices?.[0]?.message?.content) {
      // Extract content and remove markdown code block formatting
      let content = parsedData.choices[0].message.content;
      
      // Handle JSON code blocks with potential trailing text
      if (content.includes('```json')) {
        const jsonStart = content.indexOf('```json') + 7;
        const jsonEnd = content.indexOf('```', jsonStart);
        if (jsonEnd !== -1) {
          content = content.substring(jsonStart, jsonEnd).trim();
        } else {
          // Fallback: remove ```json from start and try to find JSON end
          content = content.replace(/^```json\s*/, '').replace(/\s*```.*$/, '');
        }
      }
      
      // Remove any trailing non-JSON content (like citations)
      const lines = content.split('\n');
      let jsonEndIndex = lines.length;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '}') {
          jsonEndIndex = i + 1;
          break;
        }
      }
      content = lines.slice(0, jsonEndIndex).join('\n');
      
      try {
        trendsInfo = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parse error for trends:', parseError);
        console.error('Content that failed to parse:', content);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
        throw new Error('Failed to parse trends data: ' + errorMessage);
      }
    } else {
      trendsInfo = parsedData;
    }

    if (!trendsInfo) {
      return <div>No trends data available</div>;
    }

  return (
    <div className="space-y-6">
      {/* Industry Summary */}
      {trendsInfo.industryTrendsSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {trendsInfo.industryTrendsSummary.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{trendsInfo.industryTrendsSummary.description}</p>
            {trendsInfo.industryTrendsSummary.marketReality && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Market Reality</h4>
                <p className="text-blue-800">{trendsInfo.industryTrendsSummary.marketReality}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sales Opportunities */}
      {trendsInfo.salesOpportunities && trendsInfo.salesOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Sales Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {trendsInfo.salesOpportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{opportunity.title}</h4>
                    <Badge className={getPriorityColor(opportunity.priority)}>
                      {opportunity.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{opportunity.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Urgency Factors */}
      {trendsInfo.urgencyFactors && trendsInfo.urgencyFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Urgency Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {trendsInfo.urgencyFactors.map((factor, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-red-900">{factor.title}</h4>
                    <Badge className="bg-red-100 text-red-800">
                      {factor.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-red-800">{factor.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Trends */}
      {trendsInfo.keyTrends && trendsInfo.keyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {trendsInfo.keyTrends.map((trend, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{trend.title}</h4>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(trend.priority)}>
                        {trend.priority}
                      </Badge>
                      {trend.timeframe && (
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {trend.timeframe}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{trend.description}</p>
                  {trend.marketImpact && (
                    <div className="bg-gray-50 p-3 rounded">
                      <span className="font-medium">Market Impact: </span>
                      <span className="text-gray-700">{trend.marketImpact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Latest News */}
      {trendsInfo.latestNews && trendsInfo.latestNews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Industry News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {trendsInfo.latestNews.map((news, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{news.title}</h4>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <p className="text-gray-600 mb-2">{news.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Source: {news.source}</span>
                    {news.relevance && (
                      <span className="text-blue-600 font-medium">{news.relevance}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
  } catch (error) {
    console.error('Error parsing trends data:', error);
    return <div>Error loading trends data. Please try again.</div>;
  }
};

// Regulations View Component
const RegulationsView = ({ data, getPriorityColor }: { data: any; getPriorityColor: (priority: string) => string }) => {
  try {
    console.log('RegulationsView received data:', data);
    
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    console.log('Parsed data:', parsedData);
    
    let regulationsInfo;
    if (parsedData.choices?.[0]?.message?.content) {
      // Extract content and remove markdown code block formatting
      let content = parsedData.choices[0].message.content;
      console.log('Raw content:', content);
      
      // Handle JSON code blocks with potential trailing text
      if (content.includes('```json')) {
        const jsonStart = content.indexOf('```json') + 7;
        const jsonEnd = content.indexOf('```', jsonStart);
        if (jsonEnd !== -1) {
          content = content.substring(jsonStart, jsonEnd).trim();
        } else {
          // Fallback: remove ```json from start and try to find JSON end
          content = content.replace(/^```json\s*/, '').replace(/\s*```.*$/, '');
        }
      }
      
      // Remove any trailing non-JSON content (like citations)
      const lines = content.split('\n');
      let jsonEndIndex = lines.length;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '}') {
          jsonEndIndex = i + 1;
          break;
        }
      }
      content = lines.slice(0, jsonEndIndex).join('\n');
      
      console.log('Cleaned content:', content);
      
      try {
        regulationsInfo = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parse error for regulations:', parseError);
        console.error('Content that failed to parse:', content);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
        throw new Error('Failed to parse regulations data: ' + errorMessage);
      }
    } else {
      regulationsInfo = parsedData;
    }

    console.log('Final regulationsInfo:', regulationsInfo);

    if (!regulationsInfo) {
      return <div>No regulations data available</div>;
    }

  return (
    <div className="space-y-6">
      {/* Regulations Overview */}
      {regulationsInfo.regulationsOverview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              {regulationsInfo.regulationsOverview.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{regulationsInfo.regulationsOverview.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Regulations by Material */}
      {regulationsInfo.regulationsByMaterial && regulationsInfo.regulationsByMaterial.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Regulations by Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {regulationsInfo.regulationsByMaterial.map((material, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4 text-blue-900">{material.material}</h3>
                  <div className="grid gap-3">
                    {material.regulations?.map((regulation, regIndex) => (
                      <div key={regIndex} className="bg-gray-50 p-3 rounded">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{regulation.title}</h4>
                          <Badge className={getPriorityColor(regulation.priority)}>
                            {regulation.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{regulation.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Timeframe: </span>
                            <span>{regulation.timeframe}</span>
                          </div>
                          <div>
                            <span className="font-medium">Regions: </span>
                            <span>{regulation.affectedRegions?.join(', ')}</span>
                          </div>
                        </div>
                        {regulation.complianceRequirements && (
                          <div className="mt-2 p-2 bg-blue-50 rounded">
                            <span className="font-medium text-blue-900">Requirements: </span>
                            <span className="text-blue-800">{regulation.complianceRequirements}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Regulations */}
      {regulationsInfo.upcomingRegulations && regulationsInfo.upcomingRegulations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Upcoming Regulations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {regulationsInfo.upcomingRegulations.map((regulation, index) => (
                <div key={index} className="border-l-4 border-orange-500 bg-orange-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-orange-900">{regulation.title}</h4>
                    <Badge className="bg-orange-100 text-orange-800">
                      {regulation.effectiveDate}
                    </Badge>
                  </div>
                  <p className="text-orange-800 mb-3">{regulation.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Regions: </span>
                      <span>{regulation.regions?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Preparation Time: </span>
                      <span>{regulation.preparationTime}</span>
                    </div>
                  </div>
                  {regulation.industryImpact && (
                    <div className="mt-3 p-2 bg-orange-100 rounded">
                      <span className="font-medium">Industry Impact: </span>
                      <span>{regulation.industryImpact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Requirements */}
      {regulationsInfo.complianceRequirements && regulationsInfo.complianceRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Compliance Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {regulationsInfo.complianceRequirements.map((requirement, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{requirement.requirement}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                    <div>
                      <span className="font-medium">Deadline: </span>
                      <span className="text-red-600">{requirement.deadline}</span>
                    </div>
                    <div>
                      <span className="font-medium">Regions: </span>
                      <span>{requirement.regions?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Penalties: </span>
                      <span className="text-red-600">{requirement.penalties}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
  } catch (error) {
    console.error('Error parsing regulations data:', error);
    return <div>Error loading regulations data. Please try again.</div>;
  }
};

// Analysis View Component
const AnalysisView = ({ data, getPriorityColor }: { data: any; getPriorityColor: (priority: string) => string }) => {
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    let analysisInfo;
    if (parsedData.choices?.[0]?.message?.content) {
      // Extract content and remove markdown code block formatting
      let content = parsedData.choices[0].message.content;
      
      // Handle JSON code blocks with potential trailing text
      if (content.includes('```json')) {
        const jsonStart = content.indexOf('```json') + 7;
        const jsonEnd = content.indexOf('```', jsonStart);
        if (jsonEnd !== -1) {
          content = content.substring(jsonStart, jsonEnd).trim();
        } else {
          // Fallback: remove ```json from start and try to find JSON end
          content = content.replace(/^```json\s*/, '').replace(/\s*```.*$/, '');
        }
      }
      
      // Remove any trailing non-JSON content (like citations)
      const lines = content.split('\n');
      let jsonEndIndex = lines.length;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '}') {
          jsonEndIndex = i + 1;
          break;
        }
      }
      content = lines.slice(0, jsonEndIndex).join('\n');
      
      try {
        analysisInfo = JSON.parse(content);
      } catch (parseError) {
        console.error('JSON parse error for analysis:', parseError);
        console.error('Content that failed to parse:', content);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
        throw new Error('Failed to parse analysis data: ' + errorMessage);
      }
    } else {
      analysisInfo = parsedData;
    }

    if (!analysisInfo) {
      return <div>No analysis data available</div>;
    }

  return (
    <div className="space-y-6">
      {/* Strategic Overview */}
      {analysisInfo.strategicOverview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {analysisInfo.strategicOverview.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{analysisInfo.strategicOverview.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Market Opportunities */}
      {analysisInfo.marketOpportunities && analysisInfo.marketOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Market Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {analysisInfo.marketOpportunities.map((opportunity, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{opportunity.opportunity}</h4>
                  <p className="text-gray-600 mb-3">{opportunity.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Trend Drivers: </span>
                      <span>{opportunity.trendDrivers?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Time to Market: </span>
                      <span>{opportunity.timeToMarket}</span>
                    </div>
                    <div>
                      <span className="font-medium">Investment Required: </span>
                      <span>{opportunity.investmentRequired}</span>
                    </div>
                    <div>
                      <span className="font-medium">Regulatory Support: </span>
                      <span>{opportunity.regulatorySupport}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors */}
      {analysisInfo.riskFactors && analysisInfo.riskFactors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {analysisInfo.riskFactors.map((risk, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-red-900">{risk.risk}</h4>
                    <div className="flex gap-2">
                      <Badge className="bg-red-100 text-red-800">
                        {risk.probability} Probability
                      </Badge>
                      <Badge className="bg-red-100 text-red-800">
                        {risk.impact} Impact
                      </Badge>
                    </div>
                  </div>
                  <p className="text-red-800 mb-3">{risk.description}</p>
                  {risk.mitigation && (
                    <div className="bg-red-100 p-3 rounded">
                      <span className="font-medium text-red-900">Mitigation: </span>
                      <span className="text-red-800">{risk.mitigation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable Insights */}
      {analysisInfo.actionableInsights && analysisInfo.actionableInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Actionable Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {analysisInfo.actionableInsights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{insight.insight}</h4>
                    <Badge className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{insight.description}</p>
                  {insight.expectedOutcome && (
                    <div className="bg-blue-50 p-3 rounded">
                      <span className="font-medium text-blue-900">Expected Outcome: </span>
                      <span className="text-blue-800">{insight.expectedOutcome}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Competitive Advantage */}
      {analysisInfo.competitiveAdvantage && analysisInfo.competitiveAdvantage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Competitive Advantage Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {analysisInfo.competitiveAdvantage.map((advantage, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{advantage.advantage}</h4>
                  <p className="text-gray-600 mb-3">{advantage.description}</p>
                  {advantage.implementation && (
                    <div className="bg-purple-50 p-3 rounded">
                      <span className="font-medium text-purple-900">Implementation: </span>
                      <span className="text-purple-800">{advantage.implementation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
  } catch (error) {
    console.error('Error parsing analysis data:', error);
    return <div>Error loading analysis data. Please try again.</div>;
  }
};

export default TrendsRegulations;
