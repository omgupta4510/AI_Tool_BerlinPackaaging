// Mock data service to simulate API calls
// In production, replace with actual ZoomInfo, D&B, and news API calls

export interface CompanyData {
  name: string;
  logo?: string;
  industry: string;
  segment: string;
  headquarters: string;
  foundingYear: number;
  employeeCount: string;
  productCategories: string[];
  globalPresence: string[];
  description: string;
  website?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  date: string;
  url?: string;
  summary?: string;
}

const mockCompanies: Record<string, CompanyData> = {
  microsoft: {
    name: "Microsoft Corporation",
    industry: "Technology",
    segment: "Software & Cloud Services",
    headquarters: "Redmond, Washington, USA",
    foundingYear: 1975,
    employeeCount: "221,000+",
    productCategories: [
      "Cloud Computing",
      "Operating Systems", 
      "Productivity Software",
      "Gaming",
      "AI & Machine Learning",
      "Developer Tools"
    ],
    globalPresence: [
      "United States", "Canada", "United Kingdom", "Germany", "France", 
      "India", "China", "Japan", "Australia", "Brazil", "Mexico"
    ],
    description: "Microsoft Corporation is a multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    website: "https://www.microsoft.com"
  },
  apple: {
    name: "Apple Inc.",
    industry: "Technology",
    segment: "Consumer Electronics",
    headquarters: "Cupertino, California, USA",
    foundingYear: 1976,
    employeeCount: "154,000+",
    productCategories: [
      "Smartphones",
      "Computers & Tablets",
      "Wearables",
      "Software & Services",
      "Digital Content"
    ],
    globalPresence: [
      "United States", "China", "United Kingdom", "Germany", "Japan",
      "Australia", "Canada", "France", "India", "South Korea"
    ],
    description: "Apple Inc. is a multinational technology company specializing in consumer electronics, computer software, and online services, known for innovative products like iPhone, iPad, Mac, and Apple Watch.",
    website: "https://www.apple.com"
  },
  tesla: {
    name: "Tesla, Inc.",
    industry: "Automotive",
    segment: "Electric Vehicles & Clean Energy",
    headquarters: "Austin, Texas, USA",
    foundingYear: 2003,
    employeeCount: "140,000+",
    productCategories: [
      "Electric Vehicles",
      "Energy Storage",
      "Solar Panels",
      "Autonomous Driving",
      "Charging Infrastructure"
    ],
    globalPresence: [
      "United States", "China", "Germany", "United Kingdom", "Canada",
      "Australia", "Netherlands", "Norway", "Japan", "South Korea"
    ],
    description: "Tesla, Inc. is an electric vehicle and clean energy company that designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems.",
    website: "https://www.tesla.com"
  }
};

const mockNews: Record<string, NewsArticle[]> = {
  microsoft: [
    {
      id: "1",
      headline: "Microsoft Reports Strong Q4 2024 Earnings Driven by Cloud Growth",
      source: "Reuters",
      date: "2 days ago",
      summary: "Microsoft's Azure cloud services showed 29% year-over-year growth, exceeding analyst expectations and driving overall revenue growth.",
      url: "#"
    },
    {
      id: "2", 
      headline: "Microsoft AI Assistant Copilot Reaches 100 Million Users",
      source: "TechCrunch",
      date: "1 week ago",
      summary: "The company announced significant adoption of its AI-powered productivity tools across enterprise customers.",
      url: "#"
    },
    {
      id: "3",
      headline: "Microsoft Announces Major Investment in Renewable Energy",
      source: "Wall Street Journal", 
      date: "2 weeks ago",
      summary: "The tech giant commits to carbon negative operations by 2030 with new solar and wind energy partnerships.",
      url: "#"
    }
  ],
  apple: [
    {
      id: "1",
      headline: "Apple Unveils Next-Generation M4 Chip with Enhanced AI Capabilities",
      source: "Bloomberg",
      date: "3 days ago",
      summary: "The new processor promises 40% better performance and advanced machine learning features for Mac computers.",
      url: "#"
    },
    {
      id: "2",
      headline: "iPhone 16 Pre-Orders Exceed Expectations Despite Market Challenges",
      source: "CNBC",
      date: "1 week ago", 
      summary: "Strong consumer demand for the latest iPhone model signals resilient brand loyalty amid economic uncertainty.",
      url: "#"
    },
    {
      id: "3",
      headline: "Apple Expands Health Features in Latest watchOS Update",
      source: "The Verge",
      date: "2 weeks ago",
      summary: "New health monitoring capabilities include advanced sleep tracking and mental health assessments.",
      url: "#"
    }
  ],
  tesla: [
    {
      id: "1",
      headline: "Tesla Cybertruck Deliveries Begin After Years of Delays",
      source: "CNN Business",
      date: "1 day ago",
      summary: "The electric pickup truck finally reaches customers with initial deliveries starting in Texas and California.",
      url: "#"
    },
    {
      id: "2",
      headline: "Tesla Opens New Gigafactory in Mexico, Expanding Global Production",
      source: "Forbes",
      date: "5 days ago",
      summary: "The facility will focus on producing more affordable Tesla models for the Latin American market.",
      url: "#"
    },
    {
      id: "3",
      headline: "Tesla's Full Self-Driving Beta Shows Promising Safety Improvements",
      source: "Automotive News",
      date: "1 week ago",
      summary: "Latest software update demonstrates significant reduction in intervention rates during autonomous driving tests.",
      url: "#"
    }
  ]
};

export const searchCompany = async (companyName: string): Promise<CompanyData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const key = companyName.toLowerCase();
  return mockCompanies[key] || null;
};

export const getCompanyNews = async (companyName: string): Promise<NewsArticle[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const key = companyName.toLowerCase();
  return mockNews[key] || [];
};