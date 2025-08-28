const { getJson } = require("serpapi");

class ImageSearchService {
  constructor() {
    // Load environment variables
    require('dotenv').config();
    this.apiKey = process.env.SERP_API_KEY;
    this.cache = new Map(); // Simple in-memory cache
    
    if (!this.apiKey) {
      console.warn('SERP_API_KEY not found in environment variables. Image search will not work.');
    }
  }

  async searchProductImage(companyName, productName) {
    try {
      // Create cache key
      const cacheKey = `${companyName}-${productName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        console.log(`Cache hit for: ${cacheKey}`);
        return this.cache.get(cacheKey);
      }

      // Construct search query
      const query = `${companyName} ${productName} product image`;
      
      console.log(`Searching for image: ${query}`);

      // Search parameters
      const searchParams = {
        q: query,
        tbm: "isch", // Image search
        api_key: this.apiKey,
        num: 5, // Get top 5 results
        safe: "active",
        ijn: 0 // First page
      };

      // Perform search
      const response = await getJson(searchParams);

      // Extract best image URL
      const imageUrl = this.extractBestImageUrl(response, companyName, productName);

      // Cache the result for 1 hour
      this.cache.set(cacheKey, imageUrl);
      setTimeout(() => {
        this.cache.delete(cacheKey);
      }, 3600000); // 1 hour

      return imageUrl;

    } catch (error) {
      console.error(`Error searching for image of ${productName}:`, error.message);
      return "Not Available";
    }
  }

  async searchCompanyLogo(companyName) {
    try {
      // Create cache key for logo
      const cacheKey = `logo-${companyName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        console.log(`Logo cache hit for: ${cacheKey}`);
        return this.cache.get(cacheKey);
      }

      // Construct search query specifically for logos
      const query = `${companyName} logo image`;
      
      console.log(`Searching for company logo: ${query}`);

      // Search parameters optimized for logos
      const searchParams = {
        q: query,
        tbm: "isch", // Image search
        api_key: this.apiKey,
        num: 8, // Get more results for logos
        safe: "active",
        ijn: 0, // First page
        imgtype: "clipart" // Prefer clipart/logo type images
      };

      // Perform search
      const response = await getJson(searchParams);
      console.log('SerpApi logo response received:', response ? 'Success' : 'Failed');
      console.log('Logo response keys:', response ? Object.keys(response) : 'No response');
      if (response && response.error) {
        console.error('SerpApi error:', response.error);
      }

      // Extract best logo URL
      const logoUrl = this.extractBestLogoUrl(response, companyName);

      // Cache the result for 6 hours (logos change less frequently)
      this.cache.set(cacheKey, logoUrl);
      setTimeout(() => {
        this.cache.delete(cacheKey);
      }, 21600000); // 6 hours

      return logoUrl;

    } catch (error) {
      console.error(`Error searching for logo of ${companyName}:`, error);
      return "Not Available";
    }
  }

  extractBestImageUrl(response, companyName, productName) {
    try {
      if (!response || !response.images_results || response.images_results.length === 0) {
        return "Not Available";
      }

      const images = response.images_results;
      
      // Filter and score images based on relevance
      const scoredImages = images.map(image => {
        let score = 0;
        const title = (image.title || '').toLowerCase();
        const source = (image.source || '').toLowerCase();
        const link = (image.link || '').toLowerCase();
        
        const companyLower = companyName.toLowerCase();
        const productLower = productName.toLowerCase();
        
        // Score based on title relevance
        if (title.includes(companyLower)) score += 3;
        if (title.includes(productLower)) score += 3;
        
        // Score based on source domain
        if (source.includes(companyLower.replace(/\s+/g, ''))) score += 2;
        
        // Prefer certain domains
        if (source.includes('amazon') || source.includes('walmart') || 
            source.includes('target') || source.includes('bestbuy')) score += 1;
        
        // Avoid certain types
        if (title.includes('logo') || title.includes('icon')) score -= 2;
        if (link.includes('logo') || link.includes('icon')) score -= 2;
        
        // Prefer larger images
        if (image.original_width && image.original_height) {
          const area = image.original_width * image.original_height;
          if (area > 50000) score += 1; // Prefer images larger than ~224x224
        }

        return { ...image, score };
      });

      // Sort by score (highest first)
      scoredImages.sort((a, b) => b.score - a.score);

      // Return the best image URL
      const bestImage = scoredImages[0];
      
      if (bestImage && bestImage.original) {
        console.log(`Best image found for ${productName}: ${bestImage.title} (Score: ${bestImage.score})`);
        return bestImage.original;
      }

      return "Not Available";

    } catch (error) {
      console.error('Error extracting image URL:', error.message);
      return "Not Available";
    }
  }

  extractBestLogoUrl(response, companyName) {
    try {
      if (!response || !response.images_results || response.images_results.length === 0) {
        return "Not Available";
      }

      const images = response.images_results;
      
      // Filter and score images specifically for logos
      const scoredLogos = images.map(image => {
        let score = 0;
        const title = (image.title || '').toLowerCase();
        const source = (image.source || '').toLowerCase();
        const link = (image.link || '').toLowerCase();
        
        const companyLower = companyName.toLowerCase();
        const companyWords = companyLower.split(/\s+/);
        
        // High score for logo-specific terms
        if (title.includes('logo')) score += 5;
        if (title.includes('brand')) score += 3;
        if (title.includes('symbol')) score += 2;
        if (title.includes('icon')) score += 2;
        
        // Score based on company name in title
        companyWords.forEach(word => {
          if (word.length > 2 && title.includes(word)) {
            score += 4;
          }
        });
        
        // Prefer official company domains
        const companyDomain = companyLower.replace(/\s+/g, '');
        if (source.includes(companyDomain)) score += 6;
        if (source.includes('.com') && source.includes(companyWords[0])) score += 3;
        
        // Prefer certain reliable sources for logos
        if (source.includes('wikipedia') || source.includes('wikimedia')) score += 2;
        if (source.includes('seeklogo') || source.includes('brandslogos')) score += 2;
        if (source.includes('logopedia') || source.includes('logotypes')) score += 2;
        
        // Avoid product images
        if (title.includes('product') || title.includes('bottle') || 
            title.includes('package') || title.includes('can')) score -= 3;
        
        // Prefer square or landscape logos (typical logo proportions)
        if (image.original_width && image.original_height) {
          const ratio = image.original_width / image.original_height;
          if (ratio >= 0.5 && ratio <= 2.5) score += 2; // Good logo proportions
          
          // Prefer reasonable logo sizes
          const area = image.original_width * image.original_height;
          if (area > 10000 && area < 500000) score += 1; // Good logo size range
        }

        // Bonus for PNG (transparent backgrounds)
        if (link.includes('.png') || title.includes('png')) score += 1;

        return { ...image, score };
      });

      // Sort by score (highest first)
      scoredLogos.sort((a, b) => b.score - a.score);

      // Return the best logo URL
      const bestLogo = scoredLogos[0];
      
      if (bestLogo && bestLogo.original) {
        console.log(`Best logo found for ${companyName}: ${bestLogo.title} (Score: ${bestLogo.score})`);
        return bestLogo.original;
      }

      return "Not Available";

    } catch (error) {
      console.error('Error extracting logo URL:', error.message);
      return "Not Available";
    }
  }

  async searchMultipleProductImages(companyName, products) {
    const results = [];
    
    for (const product of products) {
      try {
        const imageUrl = await this.searchProductImage(companyName, product.name);
        results.push({
          ...product,
          imageUrl: imageUrl
        });
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Error searching image for ${product.name}:`, error.message);
        results.push({
          ...product,
          imageUrl: "Not Available"
        });
      }
    }
    
    return results;
  }

  // Clear cache manually if needed
  clearCache() {
    this.cache.clear();
    console.log('Image search cache cleared');
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

module.exports = new ImageSearchService();
