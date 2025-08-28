import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Building, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CompanySearchService, CompanySearchResult } from '../services/companySearchService';

interface CompanySearchProps {
  onSearch: (companyName: string, companyData?: any) => void;
  isLoading: boolean;
}

export const CompanySearch = ({ onSearch, isLoading }: CompanySearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    console.log(`[CompanySearch] Search query changed: "${searchQuery}"`);
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        console.log(`[CompanySearch] Starting search for: "${searchQuery}"`);
        setIsSearching(true);
        try {
          const results = await CompanySearchService.searchCompanies(searchQuery);
          console.log(`[CompanySearch] Search results:`, results);
          setSearchResults(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('[CompanySearch] Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        console.log(`[CompanySearch] Query too short, clearing results`);
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectCompany(searchResults[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectCompany = async (company: CompanySearchResult) => {
    setSearchQuery(company.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    // Try to find or create the company and get existing data
    try {
      const companyInfo = await CompanySearchService.findOrCreateCompany(company.name);
      onSearch(company.name, companyInfo);
    } catch (error) {
      console.error('Error selecting company:', error);
      onSearch(company.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onSearch(searchQuery.trim());
    }
  };

  const handleQuickSelect = (companyName: string) => {
    setSearchQuery(companyName);
    onSearch(companyName);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600';
    if (similarity >= 0.7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-black">
            Berlin Packaging
            <span className="block text-2xl font-normal text-red-600 mt-1">Intelligence Platform</span>
          </h1>
        </div>
        <p className="text-black text-xl font-medium">
          Analyze packaging industry competitors and suppliers with comprehensive insights
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-red-600 mt-2">
          <Building className="h-4 w-4" />
          <span>Smart packaging industry analysis</span>
        </div>
      </div>
      
      <div className="relative max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-600 h-5 w-5" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Enter company name (e.g., Amcor, Crown Holdings, Ball Corporation)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              className="pl-12 h-14 text-lg bg-white border-2 border-red-300 rounded-xl focus:border-red-500 focus:ring-red-500 transition-colors text-black placeholder:text-gray-500"
              disabled={isLoading}
            />
            
            {/* Loading indicator inside input */}
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              </div>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={!searchQuery.trim() || isLoading}
            className="h-14 px-10 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Analyze Company
              </>
            )}
          </Button>
        </form>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchResults.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {searchResults.map((company, index) => (
              <div
                key={company.id}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => selectCompany(company)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`}
                        className="h-8 w-8 rounded object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {company.name}
                    </div>
                    {company.industry && (
                      <div className="text-sm text-gray-500 truncate">
                        {company.industry}
                        {company.description && ` • ${company.description}`}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {company.searchCount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {company.searchCount}
                      </Badge>
                    )}
                    <div className={`${getSimilarityColor(company.similarity)}`}>
                      {Math.round(company.similarity * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
};