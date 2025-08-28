// Enhanced company data types for the sales intelligence tool

export interface SustainabilityArchetype {
  category: 'Core Sustainability brands' | 'Green Innovators' | 'Traditional Adapters' | 'Compliance Focused';
  description: string;
}

export interface MarketPosition {
  ranking: 'Above average' | 'Average' | 'Below average';
  marketContext: string;
}

export interface SustainabilityStrength {
  title: string;
  description: string;
}

export interface SustainabilityImprovement {
  title: string;
  description: string;
}

export interface ProductClaims {
  description: string;
}

export interface PackagingAssessment {
  description: string;
}

export interface Certification {
  name: string;
  status: 'certified' | 'not-certified' | 'in-progress';
  description: string;
}

export interface ESGScore {
  score: string;
  description: string;
}

export interface SustainabilityInitiative {
  title: string;
  completed: boolean;
}

export interface PublicCommitment {
  title: string;
  completed: boolean;
}

export interface NarrativeSignal {
  category: string;
  description: string;
}

export interface SustainabilityData {
  summary: string;
  archetype: SustainabilityArchetype;
  marketPosition: MarketPosition;
  strengths: SustainabilityStrength[];
  improvementAreas: SustainabilityImprovement[];
  productClaims: ProductClaims;
  packagingAssessment: PackagingAssessment;
  certifications: Certification[];
  esgScores: ESGScore;
  initiatives: SustainabilityInitiative[];
  publicCommitments: PublicCommitment[];
  narrativeSignals: NarrativeSignal[];
}

export interface CompanyBasicInfo {
  name: string;
  logo?: string;
  description: string;
  industry: string;
  vertical: string;
  headquarters: string;
  foundingYear: number;
  website?: string;
  onlineStore?: string;
}

export interface EmployeeData {
  total: string;
  breakdown?: {
    retail?: number;
    corporate?: number;
    logistics?: number;
    other?: number;
  };
}

export interface FinancialData {
  annualRevenue?: string;
  marketCap?: string;
  keyMarkets?: Array<{
    region: string;
    marketShare?: string;
  }>;
}

export interface CommercialData {
  status: 'Prospect' | 'Existing Client' | 'Lost Client' | 'Not Qualified';
  accountManager?: string;
  annualPotentialRevenue?: string;
  salesGrowthPotential?: string;
  contractDetails?: {
    duration?: string;
    totalPotential?: string;
    renewalDate?: string;
  };
}

export interface ExecutiveContact {
  name: string;
  title: string;
  email?: string;
  linkedin?: string;
  tenure?: string;
}

export interface NewsArticle {
  id: string;
  headline: string;
  date: string;
  summary: string;
  source: string;
  sourceUrl?: string;
}

export interface CompanyData {
  // Basic Overview
  basicInfo: CompanyBasicInfo;
  
  // Employee Information
  employees: EmployeeData;
  
  // Product Categories
  productCategories: string[];
  
  // Markets/Presence
  globalPresence: string[];
  
  // Recent Headlines
  recentNews: NewsArticle[];
  
  // Financial Overview
  financialData: FinancialData;
  
  // Commercial Overview
  commercialData: CommercialData;
  
  // Key Contacts
  keyContacts: ExecutiveContact[];
  
  // Sustainability Data
  sustainabilityData?: SustainabilityData;
  
  // Metadata
  lastUpdated: string;
  dataSource: 'perplexity' | 'mock' | 'cached';
}

// Perplexity API Response Structure
export interface PerplexityCompanyResponse {
  basicInfo: {
    name: string;
    description: string;
    industry: string;
    vertical: string;
    headquarters: string;
    foundingYear: number;
    website?: string;
    onlineStore?: string;
  };
  employees: {
    total: string;
    breakdown?: {
      retail?: number;
      corporate?: number;
      logistics?: number;
      other?: number;
    };
  };
  productCategories: string[];
  globalPresence: string[];
  financialData: {
    annualRevenue?: string;
    marketCap?: string;
    keyMarkets?: Array<{
      region: string;
      marketShare?: string;
    }>;
  };
  keyContacts: Array<{
    name: string;
    title: string;
    tenure?: string;
  }>;
  recentNews: Array<{
    headline: string;
    date: string;
    summary: string;
    source: string;
  }>;
  competitors?: string[];
  recentFunding?: {
    amount?: string;
    date?: string;
    round?: string;
  };
  partnerships?: string[];
}
