import { Clock, ExternalLink, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NewsArticle } from '@/types/company';

interface NewsSectionProps {
  articles: NewsArticle[];
  companyName: string;
}

export const NewsSection = ({ articles, companyName }: NewsSectionProps) => {
  if (articles.length === 0) {
    return (
      <Card className="shadow-medium bg-white border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-red-600" />
            </div>
            News & Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">
            No recent news found for {companyName}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-medium bg-white border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-red-600" />
          </div>
          Latest News & Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {articles.map((article) => (
            <div 
              key={article.id}
              className="border-l-4 border-red-500 pl-6 py-4 hover:bg-red-50 transition-all duration-200 rounded-r-lg group"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-bold text-black mb-3 leading-tight text-lg group-hover:text-red-700 transition-colors">
                    {article.headline}
                  </h3>
                  
                  {article.summary && (
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                      {article.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                        <Newspaper className="w-3 h-3 text-white" />
                      </div>
                      <span className="font-semibold">{article.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{article.date}</span>
                    </div>
                  </div>
                </div>
                
                {article.url && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-white hover:bg-red-600 transition-all p-3 rounded-lg"
                    title="Read full article"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};