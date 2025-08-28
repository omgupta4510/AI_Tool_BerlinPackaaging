import { CompanyData } from '@/types/company';

// Enhanced mock data with the new structure
const mockCompanies: Record<string, CompanyData> = {
  microsoft: {
    basicInfo: {
      name: "Microsoft Corporation",
      description: "Microsoft Corporation is a multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services. The company is known for its Windows operating systems, Microsoft Office suite, and cloud computing services.",
      industry: "Technology",
      vertical: "Software & Cloud Services",
      headquarters: "Redmond, Washington, USA",
      foundingYear: 1975,
      website: "https://www.microsoft.com",
      onlineStore: "https://www.microsoft.com/store"
    },
    employees: {
      total: "221,000+",
      breakdown: {
        corporate: 180000,
        retail: 25000,
        logistics: 10000,
        other: 6000
      }
    },
    productCategories: [
      "Cloud Computing", "Operating Systems", "Productivity Software",
      "Gaming", "AI & Machine Learning", "Developer Tools", "Hardware"
    ],
    globalPresence: [
      "United States", "Canada", "United Kingdom", "Germany", "France",
      "India", "China", "Japan", "Australia", "Brazil", "Mexico", "Netherlands"
    ],
    recentNews: [
      {
        id: "1",
        headline: "Microsoft Reports Strong Q4 2024 Earnings Driven by Cloud Growth",
        date: "2 days ago",
        summary: "Microsoft's Azure cloud services showed 29% year-over-year growth, exceeding analyst expectations and driving overall revenue growth to $62.02 billion.",
        source: "Reuters",
        sourceUrl: "#"
      },
      {
        id: "2",
        headline: "Microsoft AI Assistant Copilot Reaches 100 Million Users",
        date: "1 week ago",
        summary: "The company announced significant adoption of its AI-powered productivity tools across enterprise customers, with Copilot for Microsoft 365 seeing massive uptake.",
        source: "TechCrunch",
        sourceUrl: "#"
      },
      {
        id: "3",
        headline: "Microsoft Announces Major Investment in Renewable Energy",
        date: "2 weeks ago",
        summary: "The tech giant commits to carbon negative operations by 2030 with new solar and wind energy partnerships across multiple data centers.",
        source: "Wall Street Journal",
        sourceUrl: "#"
      }
    ],
    financialData: {
      annualRevenue: "$211.92 billion",
      marketCap: "$2.89 trillion",
      keyMarkets: [
        { region: "North America", marketShare: "45%" },
        { region: "Europe", marketShare: "25%" },
        { region: "Asia Pacific", marketShare: "20%" },
        { region: "Other", marketShare: "10%" }
      ]
    },
    commercialData: {
      status: "Existing Client",
      accountManager: "Sarah Johnson",
      annualPotentialRevenue: "$25.5M",
      salesGrowthPotential: "18%",
      contractDetails: {
        duration: "3 years",
        totalPotential: "$75.0M",
        renewalDate: "2025-12-31"
      }
    },
    keyContacts: [
      {
        name: "Satya Nadella",
        title: "Chief Executive Officer",
        tenure: "10 years"
      },
      {
        name: "Amy Hood",
        title: "Chief Financial Officer", 
        tenure: "8 years"
      },
      {
        name: "Christopher Young",
        title: "Chief Marketing Officer",
        tenure: "2 years"
      }
    ],
    sustainabilityData: {
      summary: "Sustainability is central to Microsoft's brand and strategy, guiding product innovation and customer engagement. The company prioritizes eco-friendly technology solutions, including carbon-negative operations and sustainable hardware design. Sales teams should emphasize solutions that advance Microsoft's sustainability leadership, such as cloud optimization, energy-efficient computing, and third-party verification, aligning with their ambitious public commitments and consumer expectations.",
      archetype: {
        category: "Core Sustainability brands",
        description: "Insurgent or established product leaders that have sustainability as core brand value"
      },
      marketPosition: {
        ranking: "Above average",
        marketContext: "Microsoft outperforms many technology peers by embedding sustainability into its brand DNA, product design, and business operations. Its leadership in carbon-negative commitments and renewable energy adoption sets it apart, though some peers offer greater supply chain transparency."
      },
      strengths: [
        {
          title: "Strong Leadership",
          description: "Clear sustainability vision from executive team and board-level commitment"
        },
        {
          title: "Innovation Focus",
          description: "Leading in sustainable technology development and clean energy solutions"
        }
      ],
      improvementAreas: [
        {
          title: "Supply Chain",
          description: "Limited transparency in supplier sustainability practices across global operations"
        },
        {
          title: "Reporting",
          description: "Could improve third-party sustainability verification processes and reporting frequency"
        }
      ],
      productClaims: {
        description: "Microsoft emphasizes cloud efficiency, carbon-negative operations, and sustainable hardware in their technology solutions and service descriptions."
      },
      packagingAssessment: {
        description: "Uses recyclable packaging materials, FSC-certified paper packaging, and reduced plastic components. Moving toward minimal packaging design with sustainable materials."
      },
      certifications: [
        {
          name: "ISO 14001",
          status: "certified",
          description: "Environmental management system certified"
        },
        {
          name: "Carbon Trust",
          status: "certified", 
          description: "Carbon footprint verification since 2020"
        },
        {
          name: "Cradle to Cradle",
          status: "in-progress",
          description: "Working toward circular design certification"
        }
      ],
      esgScores: {
        score: "MSCI ESG Rating: AAA, Sustainalytics: 15.2/100 (Low Risk), S&P Global CSA: 82/100",
        description: "Consistently high ESG ratings across major rating agencies"
      },
      initiatives: [
        {
          title: "Carbon negative operations by 2030",
          completed: false
        },
        {
          title: "100% renewable energy in facilities by 2025",
          completed: true
        },
        {
          title: "Zero waste to landfill program",
          completed: true
        },
        {
          title: "Sustainable sourcing for 100% of products",
          completed: false
        },
        {
          title: "AI for sustainability research program",
          completed: true
        },
        {
          title: "Employee sustainability training programs",
          completed: true
        }
      ],
      publicCommitments: [
        {
          title: "Net zero emissions by 2030",
          completed: false
        },
        {
          title: "100% recyclable packaging by 2025",
          completed: false
        },
        {
          title: "Responsible sourcing certification", 
          completed: true
        },
        {
          title: "Water positive by 2030",
          completed: false
        },
        {
          title: "Biodiversity protection initiatives",
          completed: true
        },
        {
          title: "Annual sustainability reporting transparency",
          completed: true
        }
      ],
      narrativeSignals: [
        {
          category: "Website Communication",
          description: "Prominently features sustainability section with detailed reports, goals, and progress tracking on environmental impact reduction and carbon-negative commitments."
        },
        {
          category: "Brand Mission & Vision",
          description: "Sustainability integrated into core mission statement and long-term strategic vision with specific environmental commitments and measurable targets."
        }
      ]
    },
    lastUpdated: new Date().toISOString(),
    dataSource: "mock"
  },
  
  apple: {
    basicInfo: {
      name: "Apple Inc.",
      description: "Apple Inc. is a multinational technology company specializing in consumer electronics, computer software, and online services. Known for innovative products like iPhone, iPad, Mac, and Apple Watch, the company has revolutionized multiple technology markets.",
      industry: "Technology",
      vertical: "Consumer Electronics",
      headquarters: "Cupertino, California, USA",
      foundingYear: 1976,
      website: "https://www.apple.com",
      onlineStore: "https://store.apple.com"
    },
    employees: {
      total: "154,000+",
      breakdown: {
        corporate: 120000,
        retail: 25000,
        logistics: 5000,
        other: 4000
      }
    },
    productCategories: [
      "Smartphones", "Computers & Tablets", "Wearables",
      "Software & Services", "Digital Content", "Audio Devices"
    ],
    globalPresence: [
      "United States", "China", "United Kingdom", "Germany", "Japan",
      "Australia", "Canada", "France", "India", "South Korea", "Brazil"
    ],
    recentNews: [
      {
        id: "1",
        headline: "Apple Unveils Next-Generation M4 Chip with Enhanced AI Capabilities",
        date: "3 days ago",
        summary: "The new processor promises 40% better performance and advanced machine learning features for Mac computers, setting new standards for laptop computing.",
        source: "Bloomberg",
        sourceUrl: "#"
      },
      {
        id: "2",
        headline: "iPhone 16 Pre-Orders Exceed Expectations Despite Market Challenges",
        date: "1 week ago",
        summary: "Strong consumer demand for the latest iPhone model signals resilient brand loyalty amid economic uncertainty and competitive pressure.",
        source: "CNBC",
        sourceUrl: "#"
      }
    ],
    financialData: {
      annualRevenue: "$383.29 billion",
      marketCap: "$3.04 trillion",
      keyMarkets: [
        { region: "Americas", marketShare: "42%" },
        { region: "China", marketShare: "19%" },
        { region: "Europe", marketShare: "24%" },
        { region: "Japan", marketShare: "8%" },
        { region: "Rest of Asia Pacific", marketShare: "7%" }
      ]
    },
    commercialData: {
      status: "Prospect",
      accountManager: "Michael Chen",
      annualPotentialRevenue: "$45.2M",
      salesGrowthPotential: "25%",
      contractDetails: {
        duration: "5 years",
        totalPotential: "$200.0M",
        renewalDate: "2026-06-30"
      }
    },
    keyContacts: [
      {
        name: "Tim Cook",
        title: "Chief Executive Officer",
        tenure: "13 years"
      },
      {
        name: "Luca Maestri",
        title: "Chief Financial Officer",
        tenure: "10 years"
      },
      {
        name: "Greg Joswiak",
        title: "Senior VP of Worldwide Marketing",
        tenure: "8 years"
      }
    ],
    sustainabilityData: {
      summary: "Sustainability is integral to Apple's innovation and brand identity, driving product design and manufacturing processes. The company prioritizes circular design, renewable energy, and carbon neutrality across its operations. Sales teams should highlight Apple's commitment to environmental responsibility, including recycled materials usage, carbon-neutral products, and comprehensive recycling programs, aligning with consumer values and regulatory expectations.",
      archetype: {
        category: "Core Sustainability brands",
        description: "Established technology leader with sustainability as a core brand differentiator"
      },
      marketPosition: {
        ranking: "Above average",
        marketContext: "Apple leads consumer electronics companies in sustainability initiatives through comprehensive carbon neutrality commitments and innovative recycling programs. Its use of recycled materials and renewable energy sets industry standards, though supply chain transparency remains an area for continued improvement."
      },
      strengths: [
        {
          title: "Product Innovation",
          description: "Industry-leading integration of recycled materials and energy-efficient design in consumer electronics"
        },
        {
          title: "Carbon Neutrality",
          description: "Comprehensive carbon-neutral manufacturing and operations across global facilities"
        }
      ],
      improvementAreas: [
        {
          title: "Supply Chain Transparency",
          description: "Limited visibility into supplier environmental practices across complex global supply network"
        },
        {
          title: "Product Longevity",
          description: "Could enhance product repairability and extend device lifecycle to reduce electronic waste"
        }
      ],
      productClaims: {
        description: "Apple emphasizes recycled aluminum, carbon-neutral manufacturing, and energy-efficient performance in their product marketing and device specifications."
      },
      packagingAssessment: {
        description: "Uses fiber-based packaging, eliminates plastic wrapping, and incorporates recycled content. Transitioning to completely plastic-free packaging across all product lines."
      },
      certifications: [
        {
          name: "EPEAT Gold",
          status: "certified",
          description: "Electronic product environmental assessment for multiple devices"
        },
        {
          name: "ENERGY STAR",
          status: "certified",
          description: "Energy efficiency certification for computers and displays"
        },
        {
          name: "Cradle to Cradle",
          status: "in-progress",
          description: "Working toward circular design certification for key products"
        }
      ],
      esgScores: {
        score: "MSCI ESG Rating: AA, Sustainalytics: 18.5/100 (Low Risk), S&P Global CSA: 79/100",
        description: "Strong ESG performance with leading environmental initiatives"
      },
      initiatives: [
        {
          title: "Carbon neutral products by 2030",
          completed: false
        },
        {
          title: "100% renewable energy in facilities",
          completed: true
        },
        {
          title: "Closed-loop recycling program",
          completed: true
        },
        {
          title: "Conflict-free minerals sourcing",
          completed: true
        },
        {
          title: "Packaging plastic elimination",
          completed: false
        },
        {
          title: "Supplier clean energy transition",
          completed: false
        }
      ],
      publicCommitments: [
        {
          title: "Carbon neutral by 2030",
          completed: false
        },
        {
          title: "100% recycled materials by 2030",
          completed: false
        },
        {
          title: "Responsible mining practices",
          completed: true
        },
        {
          title: "Water stewardship programs",
          completed: true
        },
        {
          title: "Biodiversity protection initiatives",
          completed: true
        },
        {
          title: "Annual environmental progress reports",
          completed: true
        }
      ],
      narrativeSignals: [
        {
          category: "Website Communication",
          description: "Dedicated environment section showcasing carbon neutrality goals, recycling innovations, and detailed environmental progress reports with transparent metrics."
        },
        {
          category: "Brand Mission & Vision",
          description: "Environmental responsibility deeply integrated into product development philosophy and corporate values, with specific commitments to leaving the planet better than found."
        }
      ]
    },
    lastUpdated: new Date().toISOString(),
    dataSource: "mock"
  },

  tesla: {
    basicInfo: {
      name: "Tesla, Inc.",
      description: "Tesla, Inc. is an electric vehicle and clean energy company that designs, develops, manufactures, and sells electric vehicles, energy generation and storage systems. The company is at the forefront of sustainable transportation and energy solutions.",
      industry: "Automotive",
      vertical: "Electric Vehicles & Clean Energy", 
      headquarters: "Austin, Texas, USA",
      foundingYear: 2003,
      website: "https://www.tesla.com",
      onlineStore: "https://shop.tesla.com"
    },
    employees: {
      total: "140,000+",
      breakdown: {
        corporate: 50000,
        retail: 15000,
        logistics: 25000,
        other: 50000
      }
    },
    productCategories: [
      "Electric Vehicles", "Energy Storage", "Solar Panels",
      "Autonomous Driving", "Charging Infrastructure", "Software"
    ],
    globalPresence: [
      "United States", "China", "Germany", "United Kingdom", "Canada",
      "Australia", "Netherlands", "Norway", "Japan", "South Korea"
    ],
    recentNews: [
      {
        id: "1",
        headline: "Tesla Cybertruck Deliveries Begin After Years of Delays",
        date: "1 day ago",
        summary: "The electric pickup truck finally reaches customers with initial deliveries starting in Texas and California, marking a significant milestone for the company.",
        source: "CNN Business",
        sourceUrl: "#"
      },
      {
        id: "2", 
        headline: "Tesla Opens New Gigafactory in Mexico, Expanding Global Production",
        date: "5 days ago",
        summary: "The facility will focus on producing more affordable Tesla models for the Latin American market, supporting the company's global expansion strategy.",
        source: "Forbes",
        sourceUrl: "#"
      }
    ],
    financialData: {
      annualRevenue: "$96.77 billion",
      marketCap: "$789.29 billion",
      keyMarkets: [
        { region: "United States", marketShare: "50%" },
        { region: "China", marketShare: "22%" },
        { region: "Europe", marketShare: "23%" },
        { region: "Other", marketShare: "5%" }
      ]
    },
    commercialData: {
      status: "Lost Client",
      accountManager: "Emma Wilson",
      annualPotentialRevenue: "$12.8M",
      salesGrowthPotential: "35%",
      contractDetails: {
        duration: "2 years",
        totalPotential: "$25.0M",
        renewalDate: "2024-09-30"
      }
    },
    keyContacts: [
      {
        name: "Elon Musk",
        title: "Chief Executive Officer",
        tenure: "15 years"
      },
      {
        name: "Vaibhav Taneja",
        title: "Chief Financial Officer",
        tenure: "1 year"
      },
      {
        name: "Drew Baglino",
        title: "Senior VP of Powertrain & Energy Engineering",
        tenure: "12 years"
      }
    ],
    lastUpdated: new Date().toISOString(),
    dataSource: "mock"
  }
};

export const searchMockCompany = async (companyName: string): Promise<CompanyData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const key = companyName.toLowerCase();
  return mockCompanies[key] || null;
};

export { mockCompanies };
