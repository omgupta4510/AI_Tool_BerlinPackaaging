const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Generate commercial strategy data for a company
router.post('/sales-play', async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    console.log(`Generating commercial strategy for: ${companyName}`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: createCommercialStrategyPrompt(companyName)
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from Perplexity API');
    }

    let content;
    try {
      let responseText = data.choices[0].message.content;
      
      // Handle JSON wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      } else {
        // Try to find JSON object directly
        const directJsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (directJsonMatch) {
          responseText = directJsonMatch[0];
        }
      }
      
      content = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      content = createFallbackCommercialStrategy(companyName);
    }

    res.json(content);
  } catch (error) {
    console.error('Commercial strategy API error:', error);
    
    // Return fallback data
    res.json(createFallbackCommercialStrategy(req.body.companyName || 'Unknown Company'));
  }
});

function createCommercialStrategyPrompt(companyName) {
  return `
Generate a comprehensive commercial strategy and sales play for targeting ${companyName} as a potential customer for sustainable packaging solutions. 

Analyze ${companyName} and create a detailed sales strategy that includes:

1. Strategic Reality - Understand their current sustainability position and packaging needs
2. Customer Archetype classification
3. Commercial Mission and Target approach
4. Value Proposition with key benefits
5. Qualifying Questions to assess opportunity
6. Suggested sales approach with phases
7. Supporting resources needed

Focus on sustainable packaging, environmental impact, cost optimization, and regulatory compliance.

Return the response as a JSON object with this exact structure:
{
  "strategicReality": {
    "title": "Strategic Reality",
    "description": "Brief description of company's sustainability position",
    "content": "Detailed analysis of their current state and needs"
  },
  "customerArchetype": {
    "title": "Customer Archetype: [Type]",
    "subtitle": "Strategic classification for targeted approach",
    "description": "Detailed description of their archetype characteristics and motivations"
  },
  "strategicFocus": {
    "title": "Strategic Focus",
    "subtitle": "Commercial mission and target approach",
    "commercialMission": "Clear mission statement for enabling their goals",
    "targetAccounts": "Description of ideal target characteristics",
    "buyerPersona": "Key decision makers and their motivations"
  },
  "valueProposition": {
    "title": "Value Proposition",
    "subtitle": "Key value drivers and benefits",
    "benefits": [
      {
        "category": "Environmental Impact",
        "description": "How we help reduce environmental footprint"
      },
      {
        "category": "Cost Optimization", 
        "description": "Long-term cost savings and efficiency gains"
      },
      {
        "category": "Regulatory Compliance",
        "description": "Staying ahead of regulations and standards"
      }
    ]
  },
  "qualifyingQuestions": {
    "title": "Qualifying Questions",
    "subtitle": "Key questions to assess opportunity",
    "categories": [
      {
        "category": "Sustainability Priority",
        "questions": [
          "What are your key sustainability goals for packaging?",
          "How do you measure packaging environmental impact?"
        ]
      },
      {
        "category": "Packaging Status Gaps",
        "questions": [
          "What packaging challenges are you facing?",
          "Where do you see the biggest gaps in your current packaging?"
        ]
      },
      {
        "category": "Decision Criteria",
        "questions": [
          "What factors drive your packaging decisions?",
          "How do you evaluate sustainable packaging solutions?"
        ]
      },
      {
        "category": "Budget Ownership",
        "questions": [
          "Who owns the packaging budget?",
          "What's your timeline for packaging decisions?"
        ]
      }
    ]
  },
  "suggestedApproach": {
    "title": "Suggested Approach",
    "subtitle": "Phase-by-phase sales methodology",
    "phases": [
      {
        "phase": "Initial Outreach",
        "activities": [
          "Research-based opening message referencing their latest sustainability report or public commitments",
          "Value-focused introduction highlighting expertise in delivering measurable sustainable packaging impact"
        ]
      },
      {
        "phase": "Discovery",
        "activities": [
          "Deep needs assessment involving cross-functional stakeholders",
          "Sustainability gap analysis comparing current packaging to best-in-class benchmarks"
        ]
      },
      {
        "phase": "Proposal",
        "activities": [
          "Customized solution presentation with material samples and lifecycle data",
          "ROI and impact demonstration including environmental metrics and cost projections"
        ]
      },
      {
        "phase": "Maintain Build Account",
        "activities": [
          "Ongoing relationship building through regular business reviews and sustainability updates",
          "Continuous value delivery with proactive recommendations and innovation workshops"
        ]
      }
    ]
  },
  "suggestedResources": {
    "title": "Suggested Resources",
    "subtitle": "Tools and materials to support the sales process",
    "categories": [
      {
        "category": "Customer Specific Information",
        "resources": [
          "Industry sustainability reports",
          "Company sustainability commitments"
        ]
      },
      {
        "category": "Industry Resources", 
        "resources": [
          "Packaging sustainability trends",
          "Regulatory landscape updates"
        ]
      },
      {
        "category": "Internal Sales Support",
        "resources": [
          "Technical expertise required",
          "Sales engineering support"
        ]
      }
    ]
  },
  "winningMessage": "Empower ${companyName} to lead the industry by integrating breakthrough sustainable packaging solutions that elevate brand equity, reduce environmental impact, and deliver tangible business value."
}`;
}

function createFallbackCommercialStrategy(companyName) {
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

// Generate winning message data for a company
router.post('/winning-message', async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    console.log(`Generating winning message for: ${companyName}`);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-reasoning',
        messages: [
          {
            role: 'user',
            content: createWinningMessagePrompt(companyName)
          }
        ],
        temperature: 0.4,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from Perplexity API');
    }

    let content;
    try {
      let responseText = data.choices[0].message.content;
      
      // Handle JSON wrapped in markdown code blocks
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        responseText = jsonMatch[1];
      } else {
        // Try to find JSON object directly
        const directJsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (directJsonMatch) {
          responseText = directJsonMatch[0];
        }
      }
      
      content = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      content = createFallbackWinningMessage(companyName);
    }

    res.json(content);
  } catch (error) {
    console.error('Winning message API error:', error);
    
    // Return fallback data
    res.json(createFallbackWinningMessage(req.body.companyName || 'Unknown Company'));
  }
});

function createWinningMessagePrompt(companyName) {
  return `
Create a comprehensive winning message and sales communication strategy for targeting ${companyName} as a potential customer for sustainable packaging solutions.

Analyze ${companyName}'s brand, industry position, and sustainability commitments to develop:

1. Messaging Guidance - Core themes and value propositions
2. Opening Lines - Compelling conversation starters 
3. Discovery Questions - Specific questions to uncover needs

Focus on sustainable packaging, environmental impact, innovation, and brand alignment.

Return the response as a JSON object with this exact structure:
{
  "messagingGuidance": {
    "title": "Messaging Guidance",
    "subtitle": "Core themes and strategic messaging for ${companyName}",
    "coreMessage": "Primary value proposition statement",
    "keyThemes": [
      {
        "theme": "Sustainability Leadership",
        "description": "How sustainable packaging reinforces their market position",
        "keyPoints": [
          "Point about their sustainability goals",
          "Point about industry leadership",
          "Point about stakeholder expectations"
        ]
      },
      {
        "theme": "Innovation Partnership", 
        "description": "Positioning as an innovation partner, not just a supplier",
        "keyPoints": [
          "Point about co-innovation opportunities",
          "Point about breakthrough solutions",
          "Point about competitive advantage"
        ]
      },
      {
        "theme": "Business Impact",
        "description": "Measurable business and environmental outcomes",
        "keyPoints": [
          "Point about cost optimization",
          "Point about risk mitigation", 
          "Point about brand enhancement"
        ]
      }
    ]
  },
  "openingLines": {
    "title": "Opening Lines",
    "subtitle": "Compelling conversation starters for ${companyName}",
    "categories": [
      {
        "category": "Industry Leadership",
        "messages": [
          "Research-based opening referencing their sustainability achievements",
          "Opening connecting to their innovation pipeline",
          "Opening about their market position in sustainability"
        ]
      },
      {
        "category": "Value Creation",
        "messages": [
          "Opening about measurable impact opportunities",
          "Opening about competitive advantage through packaging",
          "Opening about stakeholder value creation"
        ]
      },
      {
        "category": "Partnership Approach",
        "messages": [
          "Opening about co-innovation opportunities",
          "Opening about strategic partnership potential",
          "Opening about shared sustainability goals"
        ]
      }
    ]
  },
  "discoveryQuestions": {
    "title": "Discovery Questions",
    "subtitle": "Strategic questions to uncover ${companyName}'s packaging needs and priorities",
    "categories": [
      {
        "category": "Product Innovation",
        "questions": [
          "What are ${companyName}'s top priorities for innovation in packaging across your core product lines?",
          "How does ${companyName} differentiate its packaging from other premium brands?",
          "What insights have you gathered from customers about the usability and sustainability of your current packaging?",
          "How do packaging innovations fit into ${companyName}'s broader product development and launch roadmap?",
          "Which emerging packaging trends in your industry are most relevant to ${companyName}'s future plans?"
        ]
      },
      {
        "category": "Brand Alignment", 
        "questions": [
          "How does ${companyName}'s brand story incorporate your sustainability journey, particularly in packaging?",
          "In what ways does packaging contribute to ${companyName}'s signature customer experience, both in-store and online?",
          "How does ${companyName} communicate your packaging sustainability efforts to customers and stakeholders?",
          "What are ${companyName}'s overarching corporate sustainability goals, and how does packaging play a role in achieving them?",
          "What expectations do ${companyName}'s stakeholders—including investors and retail partners—have around sustainability reporting and packaging transparency?"
        ]
      }
    ]
  }
}`;
}

function createFallbackWinningMessage(companyName) {
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

module.exports = router;
