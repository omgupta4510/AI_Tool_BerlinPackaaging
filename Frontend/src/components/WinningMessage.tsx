import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MessageSquare, 
  Lightbulb, 
  HelpCircle, 
  RefreshCw,
  Copy,
  CheckCircle,
  Sparkles,
  Target,
  Users,
  Quote
} from 'lucide-react';
import { CompanyData } from '../types/company';
import CommercialStrategyService, { WinningMessageData } from '../services/commercialStrategyService';
import { useToast } from '../hooks/use-toast';

interface WinningMessageProps {
  companyData: CompanyData;
  winningMessageData?: any;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

const WinningMessage: React.FC<WinningMessageProps> = ({ 
  companyData,
  winningMessageData: propWinningMessageData,
  loading: propLoading = false,
  onRefresh
}) => {
  const [localData, setLocalData] = useState<WinningMessageData | null>(null);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Use props data if available, otherwise use local state
  const data = propWinningMessageData || localData;
  const isLoading = propLoading || localIsLoading;

  useEffect(() => {
    if (companyData?.basicInfo?.name && !hasLoaded && !propWinningMessageData && !onRefresh) {
      loadWinningMessage();
    }
  }, [companyData?.basicInfo?.name, hasLoaded, propWinningMessageData, onRefresh]);

  // Reset when company changes
  useEffect(() => {
    if (companyData?.basicInfo?.name) {
      setHasLoaded(false);
      if (!propWinningMessageData) {
        setLocalData(null);
      }
    }
  }, [companyData?.basicInfo?.name, propWinningMessageData]);

  const loadWinningMessage = async () => {
    if (!companyData?.basicInfo?.name || hasLoaded || propWinningMessageData) return;

    if (onRefresh) {
      await onRefresh();
      setHasLoaded(true);
      return;
    }

    setLocalIsLoading(true);
    try {
      const messageData = await CommercialStrategyService.fetchWinningMessage(companyData.basicInfo.name);
      setLocalData(messageData);
      setHasLoaded(true);
    } catch (error) {
      console.error('Error loading winning message:', error);
      toast({
        title: "Error",
        description: "Failed to load winning message data",
        variant: "destructive",
      });
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    
    setHasLoaded(false);
    setLocalData(null);
    loadWinningMessage();
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(`${type}-${text.substring(0, 20)}`);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Crafting winning messages...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No winning message data available</p>
        <Button onClick={loadWinningMessage} className="mt-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Messages
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Winning Message Strategy
          </h2>
          <p className="text-gray-600 mt-1">
            AI-crafted messaging for {companyData?.basicInfo?.name}
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Messaging Guidance */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-purple-800">{data.messagingGuidance.title}</CardTitle>
          </div>
          <p className="text-sm text-purple-700">{data.messagingGuidance.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Message */}
          <div className="bg-white/70 p-4 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Quote className="w-4 h-4 text-purple-600" />
              Core Message
            </h4>
            <p className="text-gray-800 italic text-lg leading-relaxed">
              "{data.messagingGuidance.coreMessage}"
            </p>
            <Button
              onClick={() => copyToClipboard(data.messagingGuidance.coreMessage, "Core Message")}
              variant="ghost"
              size="sm"
              className="mt-3"
            >
              {copiedMessage?.includes(data.messagingGuidance.coreMessage.substring(0, 20)) ? (
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              Copy
            </Button>
          </div>

          {/* Key Themes */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Key Messaging Themes</h4>
            <div className="grid gap-4">
              {data.messagingGuidance.keyThemes.map((theme, index) => (
                <div key={index} className="bg-white/70 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {theme.theme}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{theme.description}</p>
                  <ul className="space-y-1">
                    {theme.keyPoints.map((point, pIndex) => (
                      <li key={pIndex} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opening Lines */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-800">{data.openingLines.title}</CardTitle>
          </div>
          <p className="text-sm text-blue-700">{data.openingLines.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.openingLines.categories.map((category, index) => (
            <div key={index} className="bg-white/70 p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {category.category}
                </Badge>
              </h4>
              <div className="space-y-3">
                {category.messages.map((message, mIndex) => (
                  <div key={mIndex} className="group relative">
                    <div className="bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg border border-blue-100 hover:shadow-md transition-all">
                      <p className="text-gray-800 text-sm leading-relaxed">{message}</p>
                      <Button
                        onClick={() => copyToClipboard(message, "Opening Line")}
                        variant="ghost"
                        size="sm"
                        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedMessage?.includes(message.substring(0, 20)) ? (
                          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Discovery Questions */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-green-800">{data.discoveryQuestions.title}</CardTitle>
          </div>
          <p className="text-sm text-green-700">{data.discoveryQuestions.subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.discoveryQuestions.categories.map((category, index) => (
            <div key={index} className="bg-white/70 p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.questions.map((question, qIndex) => (
                  <div key={qIndex} className="group relative">
                    <div className="bg-gradient-to-r from-green-50 to-white p-3 rounded-lg border border-green-100 hover:shadow-md transition-all">
                      <p className="text-gray-800 text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-green-500 mt-1 flex-shrink-0">?</span>
                        {question}
                      </p>
                      <Button
                        onClick={() => copyToClipboard(question, "Discovery Question")}
                        variant="ghost"
                        size="sm"
                        className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copiedMessage?.includes(question.substring(0, 20)) ? (
                          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3 mr-1" />
                        )}
                        Copy
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WinningMessage;