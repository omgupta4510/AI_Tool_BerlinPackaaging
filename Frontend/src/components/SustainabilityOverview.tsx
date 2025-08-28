import { CheckCircle, XCircle, Clock, Users, BarChart3, Leaf, Award, Target } from 'lucide-react';
import { SustainabilityData } from '@/types/company';

interface SustainabilityOverviewProps {
  sustainabilityData: SustainabilityData;
  companyName: string;
}

export const SustainabilityOverview = ({ sustainabilityData, companyName }: SustainabilityOverviewProps) => {
  const getStatusIcon = (status: 'certified' | 'not-certified' | 'in-progress') => {
    switch (status) {
      case 'certified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not-certified':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
    }
  };

  const getRankingColor = (ranking: string) => {
    switch (ranking) {
      case 'Above average':
        return 'bg-green-100 text-green-800';
      case 'Average':
        return 'bg-yellow-100 text-yellow-800';
      case 'Below average':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Sustainability Summary */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Leaf className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-green-800">Sustainability Summary</h2>
        </div>
        <p className="text-green-700 text-sm leading-relaxed">
          Analyzes {companyName}'s position on sustainability
        </p>
        <p className="text-green-800 mt-4 leading-relaxed">
          {sustainabilityData.summary}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sustainability Archetype */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Sustainability Archetype</h3>
          </div>
          
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {sustainabilityData.archetype.category}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed">
            {sustainabilityData.archetype.description}
          </p>
        </div>

        {/* Market Position vs Peers */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Market Position vs Peers</h3>
          </div>
          
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getRankingColor(sustainabilityData.marketPosition.ranking)}`}>
              {sustainabilityData.marketPosition.ranking}
            </span>
            <p className="text-xs text-gray-500 mt-1">Overall Market Ranking</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-2">Market Context</p>
            <p className="text-gray-700 text-sm leading-relaxed">
              {sustainabilityData.marketPosition.marketContext}
            </p>
          </div>
        </div>
      </div>

      {/* Strengths and Improvement Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths vs Peers */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-green-800">Strengths vs Peers</h3>
          </div>
          
          <div className="space-y-4">
            {sustainabilityData.strengths.map((strength, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">{strength.title}</h4>
                <p className="text-green-700 text-sm leading-relaxed">{strength.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Areas vs Peers */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-orange-800">Improvement Areas vs Peers</h3>
          </div>
          
          <div className="space-y-4">
            {sustainabilityData.improvementAreas.map((area, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-800 mb-2">{area.title}</h4>
                <p className="text-orange-700 text-sm leading-relaxed">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product & Packaging Sustainability */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-gray-900">Product & Packaging Sustainability</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Checks whether {companyName} makes sustainability-related claims in their product and packaging descriptions
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Product Claims</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {sustainabilityData.productClaims.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Packaging Assessment</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {sustainabilityData.packagingAssessment.description}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Performance Analysis */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-bold text-gray-900">Detailed Performance Analysis</h3>
        </div>

        {/* Certifications & Standards */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-800 mb-4">Certifications & Standards</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sustainabilityData.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(cert.status)}
                    <span className="font-medium text-gray-800">{cert.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESG Scores & Ratings */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-800 mb-4">ESG Scores & Ratings</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">{sustainabilityData.esgScores.score}</p>
            <p className="text-blue-700 text-sm mt-1">{sustainabilityData.esgScores.description}</p>
          </div>
        </div>

        {/* Sustainability Initiatives and Public Commitments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sustainability Initiatives */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Sustainability Initiatives</h4>
            <div className="space-y-3">
              {sustainabilityData.initiatives.map((initiative, index) => (
                <div key={index} className="flex items-center gap-3">
                  {initiative.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  )}
                  <span className="text-gray-700 text-sm">{initiative.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Public Commitments */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Public Commitments</h4>
            <div className="space-y-3">
              {sustainabilityData.publicCommitments.map((commitment, index) => (
                <div key={index} className="flex items-center gap-3">
                  {commitment.completed ? (
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                  <span className="text-gray-700 text-sm">{commitment.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Narrative Signals */}
        <div className="mt-8">
          <h4 className="font-semibold text-gray-800 mb-4">Narrative Signals</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sustainabilityData.narrativeSignals.map((signal, index) => (
              <div key={index}>
                <h5 className="font-medium text-gray-800 mb-2">{signal.category}</h5>
                <p className="text-gray-600 text-sm leading-relaxed">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
