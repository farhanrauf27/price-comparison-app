import { ScrapedProduct, FilterState } from '@/types/shopping';

export const INITIAL_FILTERS: FilterState = {
  category: 'all',
  minPrice: 0,
  maxPrice: 2000,
  minRating: 0,
  brands: [],
  stores: [],
  onlyAvailable: false,
  sortBy: 'cheapest',
};

export function processProducts(products: ScrapedProduct[], filters: FilterState): ScrapedProduct[] {
  return products
    .filter(product => {
      // Category filter
      if (filters.category !== 'all' && product.category) {
        if (product.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      }

      // Price range filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) return false;

      // Rating filter
      if (product.rating < filters.minRating) return false;

      // Store filter
      if (filters.stores.length > 0) {
        if (!filters.stores.includes(product.retailerName.toUpperCase())) return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && product.brand) {
        if (!filters.brands.includes(product.brand)) return false;
      }

      // Availability filter
      if (filters.onlyAvailable && !product.isAvailable) return false;

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'cheapest':
          return a.price - b.price;
        case 'most_expensive':
          return b.price - a.price;
        case 'highest_rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'best_match':
        default:
          return 0; // Preserves scraped relevance score
      }
    });
}