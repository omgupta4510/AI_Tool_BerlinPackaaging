// Commercial Strategy Service
export interface CommercialStrategyData {
  strategicReality: {
    title: string;
    description: string;
    content: string;
  };
  customerArchetype: {
    title: string;
    subtitle: string;
    description: string;
  };
  strategicFocus: {
    title: string;
    subtitle: string;
    commercialMission: string;
    targetAccounts: string;
    buyerPersona: string;
  };
  valueProposition: {
    title: string;
    subtitle: string;
    benefits: Array<{
      category: string;
      description: string;
    }>;
  };
  qualifyingQuestions: {
    title: string;
    subtitle: string;
    categories: Array<{
      category: string;
      questions: string[];
    }>;
  };
  suggestedApproach: {
    title: string;
    subtitle: string;
    phases: Array<{
      phase: string;
      activities: string[];
    }>;
  };
  suggestedResources: {
    title: string;
    subtitle: string;
    categories: Array<{
      category: string;
      resources: string[];
    }>;
  };
  winningMessage: string;
}

export interface WinningMessageData {
  messagingGuidance: {
    title: string;
    subtitle: string;
    coreMessage: string;
    keyThemes: Array<{
      theme: string;
      description: string;
      keyPoints: string[];
    }>;
  };
  openingLines: {
    title: string;
    subtitle: string;
    categories: Array<{
      category: string;
      messages: string[];
    }>;
  };
  discoveryQuestions: {
    title: string;
    subtitle: string;
    categories: Array<{
      category: string;
      questions: string[];
    }>;
  };
}

class CommercialStrategyService {
  private baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001/api';

  async fetchSalesPlay(companyName: string): Promise<CommercialStrategyData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/commercial-strategy/sales-play`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching commercial strategy:', error);
      
      // Return fallback data if API fails
      return this.getFallbackSalesPlay(companyName);
    }
  }

  async fetchWinningMessage(companyName: string): Promise<WinningMessageData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/commercial-strategy/winning-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching winning message:', error);
      
      // Return fallback data if API fails
      return this.getFallbackWinningMessage(companyName);
    }
  }

  private getFallbackSalesPlay(companyName: string): CommercialStrategyData {
    return {
      strategicReality: {
        title: "Strategic Reality",
        description: `${companyName} sustainability position analysis`,
        content: `${companyName} is positioned as a forward-thinking organization with sustainability commitments, seeking innovative packaging solutions that reinforce their leadership and deliver measurable impact.`
      },
      customerArchetype: {
        title: "Customer Archetype: Core Sustainability brands",
        subtitle: "Strategic classification for targeted approach",
        description: "Companies with sustainability embedded at the core of their brand and business strategy. They are early adopters of green innovations, set ambitious public sustainability targets, and seek partners who can help them lead on environmental and social responsibility."
      },
      strategicFocus: {
        title: "Strategic Focus",
        subtitle: "Commercial mission and target approach",
        commercialMission: `Enable ${companyName} to reinforce their leadership in sustainable packaging while achieving measurable environmental and business outcomes.`,
        targetAccounts: "Established brands with public, ambitious sustainability commitments and a track record of investing in innovative packaging solutions.",
        buyerPersona: "Sustainability Director, Packaging Innovation Manager, or Head of Procurement with a mandate to deliver on sustainability KPIs and drive brand differentiation."
      },
      valueProposition: {
        title: "Value Proposition",
        subtitle: "Key value drivers and benefits",
        benefits: [
          {
            category: "Environmental Impact",
            description: `We help ${companyName} reduce their environmental footprint through advanced materials, circular design, and lifecycle analysis, supporting their net-zero and waste reduction goals.`
          },
          {
            category: "Cost Optimization",
            description: "Our solutions deliver long-term cost savings by optimizing material use, reducing waste, and improving supply chain efficiency."
          },
          {
            category: "Regulatory Compliance",
            description: `We ensure ${companyName} stays ahead of evolving packaging regulations and industry standards, minimizing compliance risks and supporting global market access.`
          }
        ]
      },
      qualifyingQuestions: {
        title: "Qualifying Questions",
        subtitle: "Key questions to assess opportunity",
        categories: [
          {
            category: "Sustainability Priority",
            questions: [
              "What are your key sustainability goals for packaging?",
              "How do you measure packaging environmental impact?"
            ]
          },
          {
            category: "Packaging Status Gaps",
            questions: [
              "What packaging challenges are you facing?",
              "Where do you see the biggest gaps in your current packaging?"
            ]
          },
          {
            category: "Decision Criteria",
            questions: [
              "What factors drive your packaging decisions?",
              "How do you evaluate sustainable packaging solutions?"
            ]
          },
          {
            category: "Budget Ownership",
            questions: [
              "Who owns the packaging budget?",
              "What's your timeline for packaging decisions?"
            ]
          }
        ]
      },
      suggestedApproach: {
        title: "Suggested Approach",
        subtitle: "Phase-by-phase sales methodology",
        phases: [
          {
            phase: "Initial Outreach",
            activities: [
              `Research-based opening message referencing ${companyName}'s latest sustainability report or public commitments`,
              "Value-focused introduction highlighting expertise in delivering measurable sustainable packaging impact"
            ]
          },
          {
            phase: "Discovery",
            activities: [
              "Deep needs assessment involving cross-functional stakeholders",
              "Sustainability gap analysis comparing current packaging to best-in-class benchmarks"
            ]
          },
          {
            phase: "Proposal",
            activities: [
              "Customized solution presentation with material samples and lifecycle data",
              "ROI and impact demonstration including environmental metrics and cost projections"
            ]
          },
          {
            phase: "Maintain Build Account",
            activities: [
              "Ongoing relationship building through regular business reviews and sustainability updates",
              "Continuous value delivery with proactive recommendations and innovation workshops"
            ]
          }
        ]
      },
      suggestedResources: {
        title: "Suggested Resources",
        subtitle: "Tools and materials to support the sales process",
        categories: [
          {
            category: "Customer Specific Information",
            resources: [
              "Industry sustainability reports",
              "Company sustainability commitments"
            ]
          },
          {
            category: "Industry Resources",
            resources: [
              "Packaging sustainability trends",
              "Regulatory landscape updates"
            ]
          },
          {
            category: "Internal Sales Support",
            resources: [
              "Technical expertise required",
              "Sales engineering support"
            ]
          }
        ]
      },
      winningMessage: `Empower ${companyName} to lead the industry by integrating breakthrough sustainable packaging solutions that elevate brand equity, reduce environmental impact, and deliver tangible business value.`
    };
  }

  private getFallbackWinningMessage(companyName: string): WinningMessageData {
    return {
      messagingGuidance: {
        title: "Messaging Guidance",
        subtitle: `Core themes and strategic messaging for ${companyName}`,
        coreMessage: `Partner with ${companyName} to accelerate your sustainability leadership through innovative packaging solutions that deliver measurable environmental impact and business value.`,
        keyThemes: [
          {
            theme: "Sustainability Leadership",
            description: "How sustainable packaging reinforces their market position",
            keyPoints: [
              `${companyName}'s commitment to sustainability creates opportunities for breakthrough packaging innovations`,
              "Industry leadership requires packaging solutions that exceed current standards",
              "Stakeholders expect measurable progress on environmental commitments"
            ]
          },
          {
            theme: "Innovation Partnership",
            description: "Positioning as an innovation partner, not just a supplier",
            keyPoints: [
              "Co-create packaging solutions that drive competitive advantage",
              "Access to breakthrough materials and design technologies",
              "Collaborative approach to solving complex packaging challenges"
            ]
          },
          {
            theme: "Business Impact",
            description: "Measurable business and environmental outcomes",
            keyPoints: [
              "Long-term cost optimization through efficient material use",
              "Risk mitigation through regulatory compliance and future-proofing",
              "Brand enhancement through authentic sustainability leadership"
            ]
          }
        ]
      },
      openingLines: {
        title: "Opening Lines",
        subtitle: `Compelling conversation starters for ${companyName}`,
        categories: [
          {
            category: "Industry Leadership",
            messages: [
              `I've been following ${companyName}'s sustainability commitments and see significant opportunities to amplify your impact through innovative packaging solutions.`,
              `${companyName}'s position as an industry leader creates unique opportunities for breakthrough packaging innovations that others will follow.`,
              `Your recent sustainability initiatives at ${companyName} align perfectly with emerging packaging technologies that could set new industry standards.`
            ]
          },
          {
            category: "Value Creation",
            messages: [
              `I'd like to explore how sustainable packaging innovations could deliver measurable impact for ${companyName}'s environmental and business goals.`,
              `There's an opportunity for ${companyName} to gain significant competitive advantage through next-generation sustainable packaging solutions.`,
              `I see potential for ${companyName} to create substantial stakeholder value through breakthrough packaging sustainability initiatives.`
            ]
          },
          {
            category: "Partnership Approach",
            messages: [
              `I'd like to discuss how we could co-innovate packaging solutions that advance ${companyName}'s sustainability leadership.`,
              `There's an opportunity for a strategic partnership to develop packaging innovations that exceed industry standards.`,
              `I see alignment between ${companyName}'s sustainability goals and our capabilities in breakthrough packaging solutions.`
            ]
          }
        ]
      },
      discoveryQuestions: {
        title: "Discovery Questions",
        subtitle: `Strategic questions to uncover ${companyName}'s packaging needs and priorities`,
        categories: [
          {
            category: "Product Innovation",
            questions: [
              `What are ${companyName}'s top priorities for innovation in packaging across your core product lines?`,
              `How does ${companyName} differentiate its packaging from other brands in your category?`,
              `What insights have you gathered from customers about the usability and sustainability of your current packaging?`,
              `How do packaging innovations fit into ${companyName}'s broader product development and launch roadmap?`,
              `Which emerging packaging trends are most relevant to ${companyName}'s future plans?`
            ]
          },
          {
            category: "Brand Alignment",
            questions: [
              `How does ${companyName}'s brand story incorporate your sustainability journey, particularly in packaging?`,
              `In what ways does packaging contribute to ${companyName}'s signature customer experience?`,
              `How does ${companyName} communicate your packaging sustainability efforts to customers and stakeholders?`,
              `What are ${companyName}'s overarching corporate sustainability goals, and how does packaging play a role?`,
              `What expectations do stakeholders have around ${companyName}'s sustainability reporting and packaging transparency?`
            ]
          }
        ]
      }
    };
  }
}

export default new CommercialStrategyService();
