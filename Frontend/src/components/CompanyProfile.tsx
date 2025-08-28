import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Globe, 
  Tag,
  ExternalLink,
  DollarSign,
  TrendingUp,
  UserCheck,
  Mail,
  Clock,
  Target,
  Award,
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CompanyData } from '@/types/company';

interface CompanyProfileProps {
  companyData: CompanyData;
}

export const CompanyProfile = ({ companyData }: CompanyProfileProps) => {
  const { basicInfo, employees, productCategories, globalPresence, financialData, commercialData, keyContacts } = companyData;

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <Card className="shadow-large bg-gradient-card border-gray-200">
        <CardContent className="p-8">
          <div className="flex items-start gap-8">
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center border-2 border-gray-200 shadow-soft">
              {basicInfo.logo ? (
                <img 
                  src={basicInfo.logo} 
                  alt={`${basicInfo.name} logo`}
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <Building2 className="w-12 h-12 text-gray-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl font-bold text-black">
                  {basicInfo.name}
                </h1>
                <div className="flex gap-2">
                  {basicInfo.website && (
                    <a
                      href={basicInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Company Website"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  )}
                  {basicInfo.onlineStore && (
                    <a
                      href={basicInfo.onlineStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
                      title="Online Store"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-5">
                <Badge className="bg-red-100 text-red-700 border-red-200 text-sm px-4 py-2">
                  {basicInfo.industry}
                </Badge>
                <Badge variant="outline" className="border-gray-300 text-gray-700 text-sm px-4 py-2">
                  {basicInfo.vertical}
                </Badge>
                <Badge 
                  className={`text-sm px-4 py-2 ${
                    commercialData.status === 'Existing Client' 
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : commercialData.status === 'Prospect'
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {commercialData.status}
                </Badge>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {basicInfo.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Overview Section */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        {/* Company Details */}
        <Card className="lg:col-span-2 shadow-medium bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Building2 className="w-5 h-5 text-red-600" />
              Company Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Headquarters</p>
              <p className="text-sm font-semibold text-black">{basicInfo.headquarters}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Founded</p>
              <p className="text-sm font-semibold text-black">{basicInfo.foundingYear}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Employees</p>
              <p className="text-sm font-semibold text-black">{employees.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Industry</p>
              <p className="text-sm font-semibold text-black">{basicInfo.industry}</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Highlights */}
        <Card className="shadow-medium bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              Financial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Revenue</p>
              <p className="text-lg font-bold text-green-600">
                {financialData.annualRevenue || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Market Cap</p>
              <p className="text-lg font-bold text-blue-600">
                {financialData.marketCap || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Commercial Status */}
        <Card className="shadow-medium bg-white border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Commercial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</p>
              <Badge 
                className={`text-xs px-2 py-1 ${
                  commercialData.status === 'Existing Client' 
                    ? 'bg-green-100 text-green-700'
                    : commercialData.status === 'Prospect'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {commercialData.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Annual Potential</p>
              <p className="text-lg font-bold text-orange-600">
                {commercialData.annualPotentialRevenue || 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Products */}
          <Card className="shadow-medium bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Tag className="w-5 h-5 text-blue-600" />
                Products & Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {productCategories.slice(0, 6).map((category, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="text-xs px-2 py-1"
                  >
                    {category}
                  </Badge>
                ))}
                {productCategories.length > 6 && (
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    +{productCategories.length - 6} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employee Breakdown */}
          {employees.breakdown && (
            <Card className="shadow-medium bg-white border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Users className="w-5 h-5 text-indigo-600" />
                  Team Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {employees.breakdown.corporate && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Corporate</span>
                      <span className="text-sm font-medium">{employees.breakdown.corporate.toLocaleString()}</span>
                    </div>
                  )}
                  {employees.breakdown.retail && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Retail</span>
                      <span className="text-sm font-medium">{employees.breakdown.retail.toLocaleString()}</span>
                    </div>
                  )}
                  {employees.breakdown.logistics && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Logistics</span>
                      <span className="text-sm font-medium">{employees.breakdown.logistics.toLocaleString()}</span>
                    </div>
                  )}
                  {employees.breakdown.other && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">Other</span>
                      <span className="text-sm font-medium">{employees.breakdown.other.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Market Share */}
          {financialData.keyMarkets && financialData.keyMarkets.length > 0 && (
            <Card className="shadow-medium bg-white border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                  Market Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {financialData.keyMarkets.map((market, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm text-gray-600">{market.region}</span>
                      <span className="text-sm font-medium">{market.marketShare || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Global Presence */}
          <Card className="shadow-medium bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Globe className="w-5 h-5 text-green-600" />
                Global Presence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {globalPresence.slice(0, 8).map((location, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-center text-sm font-medium"
                  >
                    {location}
                  </div>
                ))}
                {globalPresence.length > 8 && (
                  <div className="bg-gray-200 text-gray-600 px-3 py-2 rounded text-center text-sm font-medium">
                    +{globalPresence.length - 8} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          {commercialData.contractDetails && (
            <Card className="shadow-medium bg-white border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                  Contract Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="text-sm font-medium">{commercialData.contractDetails.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <span className="text-sm font-medium text-green-600">{commercialData.contractDetails.totalPotential}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Renewal</span>
                    <span className="text-sm font-medium">{commercialData.contractDetails.renewalDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Manager</span>
                    <span className="text-sm font-medium">{commercialData.accountManager}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent News Preview */}
          {companyData.recentNews.length > 0 && (
            <Card className="shadow-medium bg-white border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <Clock className="w-5 h-5 text-red-600" />
                  Recent News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {companyData.recentNews.slice(0, 2).map((news, index) => (
                    <div key={index} className="border-l-2 border-red-200 pl-3">
                      <h4 className="text-sm font-medium text-black line-clamp-2 mb-1">
                        {news.headline}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{news.date}</span>
                      </div>
                    </div>
                  ))}
                  {companyData.recentNews.length > 2 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      +{companyData.recentNews.length - 2} more articles below
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Key Contacts */}
          <Card className="shadow-medium bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <UserCheck className="w-5 h-5 text-indigo-600" />
                Key Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keyContacts.length > 0 ? keyContacts.slice(0, 4).map((contact, index) => (
                  <div key={index} className="border border-gray-200 p-3 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-black text-sm">{contact.name}</h4>
                        <p className="text-xs text-indigo-600 font-medium">{contact.title}</p>
                        {contact.tenure && (
                          <p className="text-xs text-gray-500 mt-1">
                            {contact.tenure} in position
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Mail className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <UserCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No contacts available</p>
                  </div>
                )}
                {keyContacts.length > 4 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{keyContacts.length - 4} more contacts
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-medium bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Target className="w-5 h-5 text-gray-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {basicInfo.website && (
                  <a
                    href={basicInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                    Visit Website
                  </a>
                )}
                {basicInfo.onlineStore && (
                  <a
                    href={basicInfo.onlineStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-500" />
                    Online Store
                  </a>
                )}
                <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm w-full text-left">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Send Email
                </button>
                <button className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-sm w-full text-left">
                  <Clock className="w-4 h-4 text-gray-500" />
                  Schedule Meeting
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Data Source */}
          <Card className="shadow-small bg-gray-50 border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Award className="w-3 h-3" />
                  Source: {companyData.dataSource === 'perplexity' ? 'Perplexity AI' : 'Mock Data'}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(companyData.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Source Footer */}
      <Card className="shadow-small bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-4 h-4" />
              Data Source: {companyData.dataSource === 'perplexity' ? 'Perplexity AI' : 'Mock Data'}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-4 h-4" />
              Last Updated: {new Date(companyData.lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};