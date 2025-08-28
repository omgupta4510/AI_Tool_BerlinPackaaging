# AI-Powered Sales Intelligence Tool

A comprehensive sales intelligence platform that provides detailed company profiles, financial data, key contacts, and real-time news to empower sales teams with actionable insights.

## Features

### Core Company Profile Sections

✅ **Basic Overview**
- Company logo & name
- Comprehensive description
- Industry & vertical classification
- Headquarters location
- Founded year
- Website & online store links

✅ **Employee Information**
- Total employee count
- Employee breakdown by department (retail, corporate, logistics)

✅ **Product Categories**
- Visual tag representation of product portfolio
- Hover effects for interactive experience

✅ **Global Presence**
- Countries and regions where company operates
- Market presence visualization

✅ **Recent Headlines (News)**
- News title with source attribution
- Publication date
- Short summary
- Source links (when available)

✅ **Financial Overview**
- Annual revenue
- Market capitalization
- Key markets with market share percentages

✅ **Commercial Overview**
- Account status (Prospect, Existing Client, etc.)
- Assigned account manager
- Annual potential revenue
- Sales growth potential
- Contract details (duration, total potential, renewal dates)

✅ **Key Contacts**
- Executive information (CEO, CFO, CMO, etc.)
- Contact tenure information
- Contact action buttons (email, LinkedIn)

### Technical Features

✅ **OpenAI Integration**
- Real-time company data fetching using GPT-4
- Intelligent data parsing and formatting
- Graceful fallback to mock data

✅ **Smart Caching**
- 24-hour cache duration to avoid redundant API calls
- Local storage optimization
- Cache management utilities

✅ **Responsive Design**
- Modern, clean UI with card-based layouts
- Mobile-friendly responsive design
- Consistent design system with icons and color coding

✅ **Error Handling**
- Comprehensive error messages
- Fallback data strategies
- User-friendly notifications

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "AI Tool/Frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key (optional)
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### OpenAI API Setup (Optional)

1. **Get an API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key

2. **Configure Environment**
   - Add your API key to the `.env` file
   - The app will automatically use live data when available
   - Without an API key, the app uses comprehensive mock data

## Usage

### Basic Search
1. Enter a company name in the search box
2. Click "Search" or press Enter
3. View the comprehensive company profile

### Pre-configured Examples
Click on any of the example companies:
- Microsoft
- Apple
- Tesla
- Amazon
- Google

### Data Sources
- **With OpenAI API**: Live data from GPT-4 with real-time company information
- **Without API**: Comprehensive mock data with realistic company profiles
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a438a26e-7d76-408b-b93f-f591832c6919) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
