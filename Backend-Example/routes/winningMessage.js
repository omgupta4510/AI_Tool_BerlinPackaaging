const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

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
      content = JSON.parse(data.choices[0].message.content);
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
Generate comprehensive winning messaging strategies for ${companyName} focused on sustainable packaging solutions. 

Analyze ${companyName}'s brand, industry position, sustainability commitments, and market context to create:

1. Key emphasis points that resonate with their specific challenges and goals
2. Recommended tone and messaging approach
3. Strategic opening lines that reference their actual initiatives and market position
4. Discovery questions organized by business themes
5. Messaging tips that align with their brand values

Focus on their industry dynamics, sustainability pressures, regulatory environment, and competitive positioning.

Return the response as a JSON object with this exact structure:
{
  "messagingGuidance": {
    "keyEmphasisPoints": [
      {
        "icon": "star",
        "text": "Specific emphasis point about their market position and packaging role"
      },
      {
        "icon": "star", 
        "text": "Point about their brand differentiation and sustainability leadership"
      },
      {
        "icon": "star",
        "text": "Point about their customer expectations and market pressures"
      },
      {
        "icon": "star",
        "text": "Point about industry trends and regulatory landscape"
      },
      {
        "icon": "star",
        "text": "Point about competitive advantages through sustainable packaging"
      }
    ],
    "toneAndApproach": {
      "recommendedTone": "Professional tone description that matches their brand personality",
      "messagingTips": [
        {
          "icon": "lightbulb",
          "text": "Tip about referencing their specific approach or values"
        },
        {
          "icon": "lightbulb",
          "text": "Tip about highlighting alignment with their customer base"
        },
        {
          "icon": "lightbulb",
          "text": "Tip about acknowledging their existing initiatives"
        },
        {
          "icon": "lightbulb",
          "text": "Tip about connecting to their growth or expansion goals"
        },
        {
          "icon": "lightbulb",
          "text": "Tip about positioning relative to regulatory and competitive pressures"
        }
      ]
    }
  },
  "openingLines": [
    {
      "id": 1,
      "title": "Opening Line #1",
      "content": "Compelling opening line that references their specific industry context and sustainability pressures",
      "explanation": "Brief explanation of why this line works for their specific situation",
      "copyable": true
    },
    {
      "id": 2,
      "title": "Opening Line #2", 
      "content": "Opening line that leverages their existing sustainability initiatives and brand positioning",
      "explanation": "Explanation of how this connects to their current progress and future opportunities",
      "copyable": true
    },
    {
      "id": 3,
      "title": "Opening Line #3",
      "content": "Opening line addressing the tension between their business priorities and sustainability expectations",
      "explanation": "Why this resonates with their specific business challenges",
      "copyable": true
    },
    {
      "id": 4,
      "title": "Opening Line #4",
      "content": "Visionary opening line about their potential market leadership through packaging innovation",
      "explanation": "How this positions sustainable packaging as a competitive advantage",
      "copyable": true
    },
    {
      "id": 5,
      "title": "Opening Line #5",
      "content": "Opening line connecting packaging to their growth strategy and customer loyalty",
      "explanation": "Connection to their strategic business objectives",
      "copyable": true
    },
    {
      "id": 6,
      "title": "Opening Line #6",
      "content": "Urgency-driven opening line about regulatory and market pressures in their industry",
      "explanation": "Why timing creates urgency for their specific market context",
      "copyable": true
    }
  ],
  "discoveryQuestions": {
    "categories": [
      {
        "title": "Packaging Sustainability",
        "icon": "leaf",
        "questions": [
          "How is ${companyName} currently balancing luxury design and sustainability in packaging materials and formats?",
          "What are ${companyName}'s short- and long-term sustainability commitments regarding packaging, and how do they compare to industry benchmarks?",
          "How is ${companyName} preparing for upcoming regulations on packaging in their key markets?",
          "What feedback have you received from customers about your packaging's environmental impact?",
          "How does ${companyName}'s approach to packaging reinforce brand values and customer experience?"
        ]
      },
      {
        "title": "Product Innovation",
        "icon": "cog",
        "questions": [
          "What are ${companyName}'s top priorities for innovation in packaging across core product lines?",
          "How does ${companyName} differentiate its packaging from competitors in their market?",
          "What insights have you gathered from customers about the usability and sustainability of current packaging?",
          "How do packaging innovations fit into ${companyName}'s broader product development and launch roadmap?",
          "Which emerging packaging trends are most relevant to ${companyName}'s future plans?"
        ]
      },
      {
        "title": "Brand Alignment",
        "icon": "target",
        "questions": [
          "How does ${companyName}'s brand story incorporate sustainability journey, particularly in packaging?",
          "In what ways does packaging contribute to ${companyName}'s signature customer experience?",
          "How does ${companyName} communicate packaging sustainability efforts to customers and stakeholders?",
          "What are ${companyName}'s overarching corporate sustainability goals, and how does packaging contribute?",
          "What expectations do stakeholders have around sustainability reporting and packaging transparency?"
        ]
      }
    ]
  }
}`;
}

function createFallbackWinningMessage(companyName) {
  return {
    messagingGuidance: {
      keyEmphasisPoints: [
        {
          icon: "star",
          text: `${companyName} operates at the intersection of industry leadership and sustainability, where packaging is a critical touchpoint for brand experience and environmental stewardship.`
        },
        {
          icon: "star",
          text: `As a premium brand with global reach, ${companyName} differentiates through innovation and quality, making sustainable packaging a key part of their value proposition.`
        },
        {
          icon: "star",
          text: `${companyName}'s customer base is increasingly focused on sustainability and transparency, expecting meaningful action on environmental impact.`
        },
        {
          icon: "star",
          text: "The industry faces increasing pressure to reduce environmental impact and demonstrate circularity, with evolving regulations and consumer scrutiny."
        },
        {
          icon: "star",
          text: `Sustainable packaging offers ${companyName} a competitive edge by reinforcing their brand promise, supporting loyalty, and aligning with market trends.`
        }
      ],
      toneAndApproach: {
        recommendedTone: `Warm, sophisticated, and consultative—reflecting ${companyName}'s premium brand personality and appealing to decision makers seeking innovation and authenticity.`,
        messagingTips: [
          {
            icon: "lightbulb",
            text: `Reference ${companyName}'s holistic approach to sustainability and how packaging can elevate the entire customer journey.`
          },
          {
            icon: "lightbulb",
            text: `Highlight the alignment between sustainable packaging and ${companyName}'s customer values and expectations.`
          },
          {
            icon: "lightbulb",
            text: `Acknowledge ${companyName}'s existing initiatives while identifying opportunities for further leadership.`
          },
          {
            icon: "lightbulb",
            text: `Connect sustainable packaging to ${companyName}'s ambitions for growth and market expansion.`
          },
          {
            icon: "lightbulb",
            text: "Position solutions as a means to stay ahead of regulatory changes and competitive pressures in the industry."
          }
        ]
      }
    },
    openingLines: [
      {
        id: 1,
        title: "Opening Line #1",
        content: `"With premium brands like ${companyName} redefining industry standards, how are you evolving your packaging to meet the latest sustainability expectations and consumer demands?"`,
        explanation: `This line references ${companyName}'s industry leadership and the regulatory and consumer trends shaping their market, signaling a nuanced understanding of their context.`,
        copyable: true
      },
      {
        id: 2,
        title: "Opening Line #2", 
        content: `"${companyName}'s commitment to innovation and quality sets a benchmark—how can next-generation sustainable packaging further elevate your brand's promise of excellence?"`,
        explanation: `This leverages ${companyName}'s current sustainability initiatives and brand values, opening the door for innovation while acknowledging their progress.`,
        copyable: true
      },
      {
        id: 3,
        title: "Opening Line #3",
        content: `"As ${companyName}'s customers increasingly seek transparency and authentic sustainability, what challenges do you face in balancing premium experience with environmental responsibility?"`,
        explanation: "This addresses the tension between luxury and sustainability, resonating with their specific business priorities and customer expectations.",
        copyable: true
      },
      {
        id: 4,
        title: "Opening Line #4",
        content: `"What if ${companyName} could lead the industry by making every touchpoint—from unboxing to refilling—a showcase of circular design and environmental leadership?"`,
        explanation: "This positions sustainable packaging as a competitive advantage and differentiator in the crowded premium market space.",
        copyable: true
      },
      {
        id: 5,
        title: "Opening Line #5",
        content: `"How can sustainable packaging solutions help ${companyName} accelerate global expansion while deepening loyalty among environmentally conscious customers?"`,
        explanation: `This appeals to ${companyName}'s growth objectives and the strategic role of packaging in supporting both market entry and customer retention.`,
        copyable: true
      },
      {
        id: 6,
        title: "Opening Line #6",
        content: `"With new regulations and consumer activism reshaping the industry, how is ${companyName} preparing to stay ahead and turn sustainability pressures into brand opportunity?"`,
        explanation: "This creates urgency by referencing regulatory and market pressures, positioning the conversation as both strategic and timely.",
        copyable: true
      }
    ],
    discoveryQuestions: {
      categories: [
        {
          title: "Packaging Sustainability",
          icon: "leaf",
          questions: [
            `How is ${companyName} currently balancing premium design and sustainability in packaging materials and formats?`,
            `What are ${companyName}'s short- and long-term sustainability commitments regarding packaging, and how do they compare to industry benchmarks?`,
            `How is ${companyName} preparing for upcoming regulations on packaging in their key markets?`,
            `What feedback have you received from customers about your packaging's environmental impact?`,
            `How does ${companyName}'s approach to packaging reinforce brand values and customer experience?`
          ]
        },
        {
          title: "Product Innovation",
          icon: "cog",
          questions: [
            `What are ${companyName}'s top priorities for innovation in packaging across core product lines?`,
            `How does ${companyName} differentiate its packaging from competitors in their market?`,
            `What insights have you gathered from customers about the usability and sustainability of current packaging?`,
            `How do packaging innovations fit into ${companyName}'s broader product development and launch roadmap?`,
            `Which emerging packaging trends are most relevant to ${companyName}'s future plans?`
          ]
        },
        {
          title: "Brand Alignment",
          icon: "target",
          questions: [
            `How does ${companyName}'s brand story incorporate sustainability journey, particularly in packaging?`,
            `In what ways does packaging contribute to ${companyName}'s signature customer experience?`,
            `How does ${companyName} communicate packaging sustainability efforts to customers and stakeholders?`,
            `What are ${companyName}'s overarching corporate sustainability goals, and how does packaging contribute?`,
            `What expectations do stakeholders have around sustainability reporting and packaging transparency?`
          ]
        }
      ]
    }
  };
}

module.exports = router;
