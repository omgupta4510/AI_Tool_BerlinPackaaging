const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

class ProductsService {
  static async fetchProductAnalysis(companyName: string) {
    try {
      console.log(`[ProductsService] Fetching product analysis for: ${companyName}`);
      
      const response = await fetch(`${BACKEND_BASE_URL}/api/products/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[ProductsService] API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`[ProductsService] Successfully fetched product analysis data`, data);
      
      // Extract the data from the response
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('[ProductsService] Error fetching product analysis:', error);
      throw error;
    }
  }
}

export default ProductsService;
