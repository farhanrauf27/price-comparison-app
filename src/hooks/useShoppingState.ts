'use client';

import { useState, useEffect } from 'react';
import { ScrapedProduct, PriceAlert, SearchHistoryItem } from '@/types/shopping';

const WISHLIST_KEY = 'shopping_wishlist';
const RECENTLY_VIEWED_KEY = 'shopping_recently_viewed';
const SEARCH_HISTORY_KEY = 'shopping_search_history';
const PRICE_ALERTS_KEY = 'shopping_price_alerts';

export function useShoppingState() {
  const [wishlist, setWishlist] = useState<ScrapedProduct[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<ScrapedProduct[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  // Load state on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem(WISHLIST_KEY);
      const storedRecent = localStorage.getItem(RECENTLY_VIEWED_KEY);
      const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      const storedAlerts = localStorage.getItem(PRICE_ALERTS_KEY);

      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      if (storedRecent) setRecentlyViewed(JSON.parse(storedRecent));
      if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
      if (storedAlerts) setPriceAlerts(JSON.parse(storedAlerts));
    } catch (err) {
      console.error('Failed to load local storage state', err);
    }
  }, []);

  // Save changes
  const saveStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Failed to save ${key} to local storage`, err);
    }
  };

  // Wishlist actions
  const toggleWishlist = (product: ScrapedProduct) => {
    const exists = wishlist.some(p => p.productUrl === product.productUrl);
    const updated = exists
      ? wishlist.filter(p => p.productUrl !== product.productUrl)
      : [...wishlist, product];

    setWishlist(updated);
    saveStorage(WISHLIST_KEY, updated);
  };

  const isWishlisted = (productUrl: string) => {
    return wishlist.some(p => p.productUrl === productUrl);
  };

  // Recently Viewed actions
  const addRecentlyViewed = (product: ScrapedProduct) => {
    const filtered = recentlyViewed.filter(p => p.productUrl !== product.productUrl);
    const updated = [product, ...filtered].slice(0, 10); // Keep top 10
    setRecentlyViewed(updated);
    saveStorage(RECENTLY_VIEWED_KEY, updated);
  };

  // Search History actions
  const addSearchHistory = (query: string) => {
    if (!query.trim()) return;
    const filtered = searchHistory.filter(h => h.query.toLowerCase() !== query.toLowerCase());
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [newItem, ...filtered].slice(0, 10); // Keep last 10 searches
    setSearchHistory(updated);
    saveStorage(SEARCH_HISTORY_KEY, updated);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    saveStorage(SEARCH_HISTORY_KEY, []);
  };

  // Price Alert actions
  const createPriceAlert = (product: ScrapedProduct, targetPrice: number) => {
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      productTitle: product.title,
      currentPrice: product.price,
      targetPrice,
      productUrl: product.productUrl,
      retailerName: product.retailerName,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAlert, ...priceAlerts];
    setPriceAlerts(updated);
    saveStorage(PRICE_ALERTS_KEY, updated);
  };

  const removePriceAlert = (alertId: string) => {
    const updated = priceAlerts.filter(a => a.id !== alertId);
    setPriceAlerts(updated);
    saveStorage(PRICE_ALERTS_KEY, updated);
  };

  return {
    wishlist,
    toggleWishlist,
    isWishlisted,
    recentlyViewed,
    addRecentlyViewed,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
    priceAlerts,
    createPriceAlert,
    removePriceAlert,
  };
}