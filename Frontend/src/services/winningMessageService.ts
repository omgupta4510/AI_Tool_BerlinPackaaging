// Winning Message Service
export interface WinningMessageData {
  messagingGuidance: {
    keyEmphasisPoints: Array<{
      icon: string;
      text: string;
    }>;
    toneAndApproach: {
      recommendedTone: string;
      messagingTips: Array<{
        icon: string;
        text: string;
      }>;
    };
  };
  openingLines: Array<{
    id: number;
    title: string;
    content: string;
    explanation: string;
    copyable: boolean;
  }>;
  discoveryQuestions: {
    categories: Array<{
      title: string;
      icon: string;
      questions: string[];
    }>;
  };
}

class WinningMessageService {
  private baseUrl = 'http://localhost:3001/api';

  async fetchWinningMessage(companyName: string): Promise<WinningMessageData> {
    try {
      const response = await fetch(`${this.baseUrl}/winning-message/winning-message`, {
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

  private getFallbackWinningMessage(companyName: string): WinningMessageData {
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

  // Helper method to copy text to clipboard
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }
}

export default new WinningMessageService();
