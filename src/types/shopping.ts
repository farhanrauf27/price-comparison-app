export interface ScrapedProduct {
  title: string;
  price: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
  deliveryCharges: number;
  sellerName: string;
  productUrl: string;
  retailerName: string;
  brand?: string;
  category?: string;
  createdAt?: string;
}

export type SortOption = 'cheapest' | 'most_expensive' | 'highest_rating' | 'newest' | 'best_match';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  brands: string[];
  stores: string[];
  onlyAvailable: boolean;
  sortBy: SortOption;
}

export interface PriceAlert {
  id: string;
  productTitle: string;
  targetPrice: number;
  currentPrice: number;
  productUrl: string;
  retailerName: string;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
}