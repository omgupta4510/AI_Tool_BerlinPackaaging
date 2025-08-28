import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Loader2, Package, AlertCircle, Lightbulb, TrendingUp, X, ExternalLink } from 'lucide-react';

interface ProductAnalysisProps {
  companyName: string;
  data?: any;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const ProductAnalysis: React.FC<ProductAnalysisProps> = ({ 
  companyName, 
  data, 
  loading = false, 
  error = null,
  onRefresh 
}) => {
  // Debug logging
  console.log('[ProductAnalysis] Component props:', { companyName, data, loading, error });

  // State for product detail modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProductDetail = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!companyName) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Enter a company name to analyze their products and packaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products & Packaging Analysis</h2>
          <p className="text-gray-600">Analyze current products and identify packaging opportunities</p>
        </div>
        <Button 
          onClick={onRefresh} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Analyze Products
            </>
          )}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-4 w-4 mr-2" />
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
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
              <span className="text-lg">Analyzing {companyName}'s products and packaging...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Company Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Company Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Industry</h4>
                  <p className="text-gray-600">{data.companyOverview?.industry || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900">Product Categories</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.companyOverview?.productCategories?.map((category: string, index: number) => (
                      <Badge key={index} variant="secondary">{category}</Badge>
                    )) || <span className="text-gray-500">Not available</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Current Products & Packaging</CardTitle>
              <p className="text-base text-gray-600">
                Showing {data.currentProducts?.length || 0} products with packaging analysis
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.currentProducts?.slice(0, 12).map((product: any, index: number) => (
                  <Card 
                    key={product.id || index} 
                    className="border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
                    onClick={() => openProductDetail(product)}
                  >
                    <CardContent className="pt-4">
                      {/* Product Image */}
                      <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {product.imageUrl && product.imageUrl !== "Not Available" ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-contain rounded-lg hover:object-cover transition-all duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                              }
                            }}
                          />
                        ) : null}
                        <div className={`text-gray-400 text-center ${product.imageUrl && product.imageUrl !== "Not Available" ? 'hidden' : ''}`}>
                          <Package className="h-10 w-10 mx-auto mb-2" />
                          <span className="text-sm font-medium">No Image</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-base leading-tight"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                          {product.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        <p className="text-sm text-gray-600 leading-relaxed"
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 3,
                             WebkitBoxOrient: 'vertical',
                             overflow: 'hidden'
                           }}>
                          {product.description}
                        </p>
                      </div>

                      {/* Quick Packaging Info */}
                      {product.currentPackaging && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-semibold text-sm text-gray-900 mb-2">Packaging</h5>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium text-gray-900">{product.currentPackaging.primaryPackaging}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Material:</span>
                              <span className="font-medium text-gray-900">{product.currentPackaging.material}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Click hint */}
                      <div className="mt-3 text-center">
                        <span className="text-xs text-blue-600 font-medium">Click for details</span>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-gray-500 text-base">No products data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Packaging Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Packaging Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Packaging Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.packagingAnalysis?.currentPackagingTypes?.map((packaging: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{packaging.type}</h4>
                        <Badge variant="outline">{packaging.material}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Usage: {packaging.usage}</div>
                        <div>Volume: {packaging.estimatedVolume}</div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No packaging data available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Supplier Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supplier Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.packagingAnalysis?.supplierOpportunities?.map((opportunity: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{opportunity.category}</h4>
                        <Badge className={getPriorityColor(opportunity.priority)}>
                          {opportunity.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{opportunity.opportunity}</p>
                      <div className="text-xs text-gray-500">
                        Potential Value: {opportunity.potentialValue}
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-500 text-center py-4">No opportunities data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {data.recommendations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Upcoming Trends & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upcoming Trends */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Upcoming Trends</h4>
                    <div className="space-y-3">
                      {data.recommendations.upcomingTrends?.map((trend: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-400 pl-3">
                          <h5 className="font-medium text-sm text-gray-900">{trend.trend}</h5>
                          <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                          <span className="text-xs text-blue-600">Timeline: {trend.timeline}</span>
                        </div>
                      )) || (
                        <p className="text-gray-500">No trends data available</p>
                      )}
                    </div>
                  </div>

                  {/* Sales Approach */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Sales Approach</h4>
                    <div className="space-y-3">
                      {data.recommendations.salesApproach?.keyDecisionMakers && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Key Decision Makers</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {data.recommendations.salesApproach.keyDecisionMakers.map((role: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">{role}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {data.recommendations.salesApproach?.painPoints && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Pain Points</h5>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {data.recommendations.salesApproach.painPoints.map((point: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {data.recommendations.salesApproach?.valueProposition && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700">Value Propositions</h5>
                          <ul className="text-sm text-gray-600 mt-1 space-y-1">
                            {data.recommendations.salesApproach.valueProposition.map((prop: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1 h-1 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {prop}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No data state */}
      {!loading && !data && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Product Data Available
              </h3>
              <p className="text-gray-600 mb-4 text-base">
                Click "Analyze Products" to fetch product and packaging information for {companyName}.
              </p>
              {onRefresh && (
                <Button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700">
                  <Package className="mr-2 h-4 w-4" />
                  Analyze Products
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
              <button
                onClick={closeProductDetail}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Image and Basic Info */}
                <div className="space-y-6">
                  {/* Large Product Image */}
                  <div className="w-full h-80 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {selectedProduct.imageUrl && selectedProduct.imageUrl !== "Not Available" ? (
                      <img 
                        src={selectedProduct.imageUrl} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.nextElementSibling) {
                            (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                          }
                        }}
                      />
                    ) : null}
                    <div className={`text-gray-400 text-center ${selectedProduct.imageUrl && selectedProduct.imageUrl !== "Not Available" ? 'hidden' : ''}`}>
                      <Package className="h-16 w-16 mx-auto mb-4" />
                      <span className="text-lg font-medium">No Image Available</span>
                    </div>
                  </div>

                  {/* Basic Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Details</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium text-gray-700">Category: </span>
                          <Badge variant="outline" className="ml-2">{selectedProduct.category}</Badge>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <p className="text-gray-600 mt-1 leading-relaxed">{selectedProduct.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Source Link */}
                    {selectedProduct.imageUrl && selectedProduct.imageUrl !== "Not Available" && (
                      <div className="pt-4 border-t">
                        <a 
                          href={selectedProduct.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Original Image
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Packaging Details */}
                <div className="space-y-6">
                  {/* Current Packaging */}
                  {selectedProduct.currentPackaging && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Packaging</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-600">Type:</span>
                            <p className="font-semibold text-gray-900">{selectedProduct.currentPackaging.primaryPackaging}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Material:</span>
                            <p className="font-semibold text-gray-900">{selectedProduct.currentPackaging.material}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Size:</span>
                            <p className="font-semibold text-gray-900">{selectedProduct.currentPackaging.size}</p>
                          </div>
                        </div>
                        
                        {/* Features */}
                        {selectedProduct.currentPackaging.features?.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-600 block mb-2">Features:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedProduct.currentPackaging.features.map((feature: string, featureIndex: number) => (
                                <Badge key={featureIndex} variant="secondary" className="text-sm">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Packaging Opportunities */}
                  {selectedProduct.packagingOpportunities && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Packaging Opportunities</h3>
                      <div className="space-y-4">
                        {selectedProduct.packagingOpportunities.sustainabilityUpgrade && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <Lightbulb className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-green-900 mb-2">Sustainability Upgrade</h4>
                                <p className="text-green-800 leading-relaxed">{selectedProduct.packagingOpportunities.sustainabilityUpgrade}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProduct.packagingOpportunities.costOptimization && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-blue-900 mb-2">Cost Optimization</h4>
                                <p className="text-blue-800 leading-relaxed">{selectedProduct.packagingOpportunities.costOptimization}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProduct.packagingOpportunities.brandEnhancement && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <Package className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-purple-900 mb-2">Brand Enhancement</h4>
                                <p className="text-purple-800 leading-relaxed">{selectedProduct.packagingOpportunities.brandEnhancement}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedProduct.packagingOpportunities.functionalImprovements && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-start">
                              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                              <div>
                                <h4 className="font-semibold text-orange-900 mb-2">Functional Improvements</h4>
                                <p className="text-orange-800 leading-relaxed">{selectedProduct.packagingOpportunities.functionalImprovements}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t bg-gray-50">
              <Button 
                onClick={closeProductDetail}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAnalysis;
