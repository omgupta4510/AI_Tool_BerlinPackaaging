import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  HelpCircle, 
  MapPin, 
  BookOpen,
  RefreshCw,
  Lightbulb,
  DollarSign,
  Shield,
  Leaf
} from 'lucide-react';
import { CompanyData } from '../types/company';
import CommercialStrategyService, { CommercialStrategyData } from '../services/commercialStrategyService';
import WinningMessage from './WinningMessage';
import { useToast } from '../hooks/use-toast';

interface CommercialStrategyProps {
  companyData: CompanyData;
  salesPlayData?: any;
  winningMessageData?: any;
  loading?: boolean;
  loadingWinningMessage?: boolean;
  onRefresh?: () => Promise<void>;
  onRefreshWinningMessage?: () => Promise<void>;
}

const CommercialStrategy: React.FC<CommercialStrategyProps> = ({ 
  companyData, 
  salesPlayData: propSalesPlayData,
  winningMessageData: propWinningMessageData,
  loading: propLoading = false,
  loadingWinningMessage: propLoadingWinningMessage = false,
  onRefresh,
  onRefreshWinningMessage
}) => {
  const [activeTab, setActiveTab] = useState('sales-play');
  const [localSalesPlayData, setLocalSalesPlayData] = useState<CommercialStrategyData | null>(null);
  const [localIsLoadingSalesPlay, setLocalIsLoadingSalesPlay] = useState(false);
  const [hasLoadedSalesPlay, setHasLoadedSalesPlay] = useState(false);
  const { toast } = useToast();

  // Use props data if available, otherwise use local state
  const salesPlayData = propSalesPlayData || localSalesPlayData;
  const isLoadingSalesPlay = propLoading || localIsLoadingSalesPlay;

  // Reset loaded states when company changes
  useEffect(() => {
    if (companyData?.basicInfo?.name) {
      setHasLoadedSalesPlay(false);
      if (!propSalesPlayData) {
        setLocalSalesPlayData(null);
      }
    }
  }, [companyData?.basicInfo?.name, propSalesPlayData]);

  useEffect(() => {
    if (companyData && activeTab === 'sales-play' && !hasLoadedSalesPlay && !propSalesPlayData && !onRefresh) {
      loadSalesPlay();
    }
  }, [companyData, activeTab, hasLoadedSalesPlay, propSalesPlayData, onRefresh]);

  const loadSalesPlay = async () => {
    if (!companyData?.basicInfo?.name || hasLoadedSalesPlay || propSalesPlayData) return;

    if (onRefresh) {
      await onRefresh();
      setHasLoadedSalesPlay(true);
      return;
    }

    setLocalIsLoadingSalesPlay(true);
    try {
      const data = await CommercialStrategyService.fetchSalesPlay(companyData.basicInfo.name);
      setLocalSalesPlayData(data);
      setHasLoadedSalesPlay(true);
    } catch (error) {
      console.error('Error loading sales play:', error);
      toast({
        title: "Error",
        description: "Failed to load commercial strategy data",
        variant: "destructive",
      });
    } finally {
      setLocalIsLoadingSalesPlay(false);
    }
  };

  const handleRefreshSalesPlay = () => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    
    setHasLoadedSalesPlay(false);
    setLocalSalesPlayData(null);
    loadSalesPlay();
  };

  const renderSalesPlay = () => {
    if (isLoadingSalesPlay) {
      return (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading commercial strategy...</span>
        </div>
      );
    }

    if (!salesPlayData) {
      return (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No commercial strategy data available</p>
          <Button onClick={handleRefreshSalesPlay} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Load Strategy
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Commercial Strategy Summary */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <CardTitle className="text-green-800">Commercial Strategy Summary</CardTitle>
            </div>
            <p className="text-sm text-green-700">
              Strategic approach and winning message for {companyData.basicInfo.name}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{salesPlayData.strategicReality.title}</h3>
              <p className="text-gray-700">{salesPlayData.strategicReality.content}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Sales Approach</h4>
                </div>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Position as a strategic sustainability partner, not just a supplier</li>
                  <li>• Co-create packaging solutions that exceed current industry standards</li>
                  <li>• Demonstrate measurable environmental and commercial impact</li>
                </ul>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                  <h4 className="font-medium text-purple-800">Winning Message</h4>
                </div>
                <p className="text-sm text-gray-700 italic bg-purple-50 p-3 rounded-lg border border-purple-200">
                  "{salesPlayData.winningMessage}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Archetype */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <CardTitle>{salesPlayData.customerArchetype.title}</CardTitle>
            </div>
            <p className="text-sm text-gray-600">{salesPlayData.customerArchetype.subtitle}</p>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{salesPlayData.customerArchetype.description}</p>
          </CardContent>
        </Card>

        {/* Strategic Focus */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <CardTitle>{salesPlayData.strategicFocus.title}</CardTitle>
            </div>
            <p className="text-sm text-gray-600">{salesPlayData.strategicFocus.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Commercial Mission</h4>
              <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg">
                {salesPlayData.strategicFocus.commercialMission}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Target Accounts</h4>
              <p className="text-gray-700">{salesPlayData.strategicFocus.targetAccounts}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Buyer Persona</h4>
              <p className="text-gray-700">{salesPlayData.strategicFocus.buyerPersona}</p>
            </div>
          </CardContent>
        </Card>

        {/* Value Proposition and Qualifying Questions */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Value Proposition */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-orange-600" />
                <CardTitle>{salesPlayData.valueProposition.title}</CardTitle>
              </div>
              <p className="text-sm text-gray-600">{salesPlayData.valueProposition.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {salesPlayData.valueProposition.benefits.map((benefit, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 mb-2">
                    {benefit.category === 'Environmental Impact' && <Leaf className="w-4 h-4 text-green-600" />}
                    {benefit.category === 'Cost Optimization' && <DollarSign className="w-4 h-4 text-blue-600" />}
                    {benefit.category === 'Regulatory Compliance' && <Shield className="w-4 h-4 text-purple-600" />}
                    <h4 className="font-medium text-gray-900">{benefit.category}</h4>
                  </div>
                  <p className="text-sm text-gray-700">{benefit.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Qualifying Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <CardTitle>{salesPlayData.qualifyingQuestions.title}</CardTitle>
              </div>
              <p className="text-sm text-gray-600">{salesPlayData.qualifyingQuestions.subtitle}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {salesPlayData.qualifyingQuestions.categories.map((category, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 mb-2">{category.category}</h4>
                  <ul className="space-y-1">
                    {category.questions.map((question, qIndex) => (
                      <li key={qIndex} className="text-sm text-blue-700 flex items-start gap-2">
                        <span className="text-blue-500 mt-1">→</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Suggested Approach */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              <CardTitle>{salesPlayData.suggestedApproach.title}</CardTitle>
            </div>
            <p className="text-sm text-gray-600">{salesPlayData.suggestedApproach.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesPlayData.suggestedApproach.phases.map((phase, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {phase.phase}
                </h4>
                <ul className="space-y-1 ml-6">
                  {phase.activities.map((activity, aIndex) => (
                    <li key={aIndex} className="text-sm text-gray-700 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Resources */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <CardTitle>{salesPlayData.suggestedResources.title}</CardTitle>
            </div>
            <p className="text-sm text-gray-600">{salesPlayData.suggestedResources.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesPlayData.suggestedResources.categories.map((category, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-900 mb-2">{category.category}</h4>
                <ul className="space-y-1">
                  {category.resources.map((resource, rIndex) => (
                    <li key={rIndex} className="text-sm text-blue-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">→</span>
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderWinningMessage = () => {
    return <WinningMessage companyData={companyData} />;
  };

  const renderProducts = () => {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Products</h3>
        <p className="text-gray-600">Coming soon - Product recommendations and positioning</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commercial Strategy</h2>
          <p className="text-gray-600 mt-1">
            Strategic approach and winning message for {companyData?.basicInfo?.name}
          </p>
        </div>
        {activeTab === 'sales-play' && salesPlayData && (
          <Button onClick={handleRefreshSalesPlay} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales-play" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Sales Play
          </TabsTrigger>
          <TabsTrigger value="winning-message" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Winning Message
          </TabsTrigger>
          {/* <TabsTrigger value="products" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Products
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="sales-play" className="mt-6">
          {renderSalesPlay()}
        </TabsContent>

        <TabsContent value="winning-message" className="mt-6">
          <WinningMessage 
            companyData={companyData}
            winningMessageData={propWinningMessageData}
            loading={propLoadingWinningMessage}
            onRefresh={onRefreshWinningMessage}
          />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          {renderProducts()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommercialStrategy;
