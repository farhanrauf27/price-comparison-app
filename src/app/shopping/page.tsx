'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import { FilterPanel } from '@/components/FilterPanel';
import { useShoppingState } from '@/hooks/useShoppingState';
import { processProducts, INITIAL_FILTERS } from '@/utils/filterEngine';
import { calculatePriceComparison, PriceComparisonSummary, RetailerDeal } from '@/lib/comparisonEngine';
import { ScrapedProduct, FilterState } from '@/types/shopping';
import { Search, Loader2 } from 'lucide-react';

export default function ShoppingHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'wishlist' | 'alerts' | 'history'>('search');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [deals, setDeals] = useState<RetailerDeal[]>([]);
  const [comparisonSummary, setComparisonSummary] = useState<PriceComparisonSummary | null>(null);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const {
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
  } = useShoppingState();

  // Unified POST search function matching Home (page.tsx)
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    addSearchHistory(query);
    setDeals([]);
    setComparisonSummary(null);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      const fetchedProducts: RetailerDeal[] = data.products || data.deals || (Array.isArray(data) ? data : []);

      setDeals(fetchedProducts);

      // Generate comparison summary if deals exist
      if (fetchedProducts.length > 0) {
        const summary = calculatePriceComparison(fetchedProducts);
        setComparisonSummary(summary);
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      alert(err.message || 'Scraper timed out or failed to retrieve results.');
    } finally {
      setLoading(false);
    }
  };

  // Convert RetailerDeal to ScrapedProduct format for FilterPanel processing
  const adapterProducts: ScrapedProduct[] = useMemo(() => {
    return deals.map(d => ({
      title: d.title,
      price: d.price,
      imageUrl: d.imageUrl,
      rating: d.rating || 4.5,
      isAvailable: d.isAvailable ?? true,
      deliveryCharges: d.deliveryCharges || 0,
      sellerName: d.sellerName || d.retailerName,
      productUrl: d.productUrl,
      retailerName: d.retailerName,
    }));
  }, [deals]);

  // Pass products through the Phase 8 filter/sort engine
  const filteredProducts = useMemo(() => {
    return processProducts(adapterProducts, filters);
  }, [adapterProducts, filters]);

  // Extract store and brand options for the sidebar
  const availableStores = useMemo(() => Array.from(new Set(deals.map(p => p.retailerName))), [deals]);
  const availableBrands = useMemo(() => Array.from(new Set(deals.map(p => (p as any).brand).filter(Boolean) as string[])), [deals]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans">
      {/* Top Bar Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight">SHOPPING ENGINE</h1>

          {/* Search Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            className="w-full md:w-1/2 flex items-center gap-2"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products across stores (e.g. iPhone 15, Intel i9)..."
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span>{loading ? 'Scraping...' : 'Compare'}</span>
            </button>
          </form>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => setActiveTab('search')}
              className={`pb-1 ${activeTab === 'search' ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              Results ({filteredProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`pb-1 ${activeTab === 'wishlist' ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`pb-1 ${activeTab === 'alerts' ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              Alerts ({priceAlerts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-1 ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              History
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* TAB 1: SEARCH & COMPARISON RESULTS */}
        {activeTab === 'search' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter Panel */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                availableStores={availableStores}
                availableBrands={availableBrands}
                onReset={() => setFilters(INITIAL_FILTERS)}
              />
            </div>

            {/* Main Deals Grid */}
            <div className="flex-1 space-y-8">
              {/* Loading State */}
              {loading && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <Loader2 size={40} className="animate-spin mx-auto text-indigo-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Scraping live prices across retailers...
                  </p>
                </div>
              )}

              {/* Dynamic Price Comparison Breakdown Table */}
              {!loading && searched && comparisonSummary && (
                <section>
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Price Comparison Breakdown for "{searchQuery}"
                    </h2>
                    <p className="text-sm text-slate-500">
                      Found {comparisonSummary.totalRetailersCompared} retailer deals
                    </p>
                  </div>
                  <PriceComparisonTable summary={comparisonSummary} />
                </section>
              )}

              {/* Empty State */}
              {!loading && searched && filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    No valid deals found for "{searchQuery}". Try another search term!
                  </p>
                </div>
              )}

              {/* Individual Store Deal Cards */}
              {!loading && filteredProducts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
                    Individual Store Deals
                  </h2>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                    {filteredProducts.map((product, idx) => {
                      const wishlisted = isWishlisted(product.productUrl);
                      return (
                        <div key={idx} className="relative group">
                          <ProductCard
                            id={String(idx + 1)}
                            title={product.title}
                            category={product.retailerName}
                            lowestPrice={product.price}
                            storesCount={1}
                            imageUrl={product.imageUrl}
                            productUrl={product.productUrl}
                          />
                          {/* Quick Actions Overlay Bar */}
                          <div className="mt-3 flex items-center justify-between gap-2 px-1">
                            <button
                              onClick={() => toggleWishlist(product)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                              {wishlisted ? '❤️ Saved' : '🤍 Wishlist'}
                            </button>
                            <button
                              onClick={() => {
                                const target = prompt('Set price alert threshold ($):', product.price.toString());
                                if (target && !isNaN(Number(target))) {
                                  createPriceAlert(product, Number(target));
                                  alert(`Alert set for $${target}!`);
                                }
                              }}
                              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              + Set Price Alert
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Saved Wishlist</h2>
            {wishlist.length === 0 ? (
              <p className="text-slate-500">No saved items in your wishlist yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-600">{item.retailerName}</span>
                      <h4 className="font-medium text-sm line-clamp-2 my-2">{item.title}</h4>
                      <p className="text-2xl font-black">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
                      <button onClick={() => toggleWishlist(item)} className="text-xs text-red-500 font-semibold hover:underline">
                        Remove
                      </button>
                      <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-600 hover:underline">
                        Visit Deal ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRICE ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Active Price Alerts</h2>
            {priceAlerts.length === 0 ? (
              <p className="text-slate-500">No active price alerts set.</p>
            ) : (
              <div className="space-y-3">
                {priceAlerts.map(alertItem => (
                  <div key={alertItem.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">{alertItem.productTitle}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Alert target: <strong className="text-green-600">${alertItem.targetPrice}</strong> (Initial: ${alertItem.currentPrice}) | {alertItem.retailerName}
                      </p>
                    </div>
                    <button onClick={() => removePriceAlert(alertItem.id)} className="text-xs text-red-500 font-semibold hover:underline">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SEARCH HISTORY & RECENTLY VIEWED */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Search History</h3>
                {searchHistory.length > 0 && (
                  <button onClick={clearSearchHistory} className="text-xs text-red-600 hover:underline">
                    Clear History
                  </button>
                )}
              </div>
              {searchHistory.length === 0 ? (
                <p className="text-slate-500 text-sm">No recent searches.</p>
              ) : (
                <ul className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                  {searchHistory.map(item => (
                    <li key={item.id} className="p-3 text-sm flex justify-between items-center">
                      <button
                        onClick={() => {
                          setSearchQuery(item.query);
                          handleSearch(item.query);
                        }}
                        className="text-indigo-600 font-medium hover:underline text-left"
                      >
                        {item.query}
                      </button>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Recently Viewed Deals</h3>
              {recentlyViewed.length === 0 ? (
                <p className="text-slate-500 text-sm">No recently viewed items.</p>
              ) : (
                <div className="space-y-2">
                  {recentlyViewed.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm">
                      <span className="truncate max-w-xs font-medium">{item.title}</span>
                      <span className="font-bold text-slate-900 dark:text-white">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}