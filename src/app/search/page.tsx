'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import { calculatePriceComparison, PriceComparisonSummary, RetailerDeal } from '@/lib/comparisonEngine';
import { Search, Loader2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query') || searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [loading, setLoading] = useState(false);
  const [deals, setDeals] = useState<RetailerDeal[]>([]);
  const [comparisonSummary, setComparisonSummary] = useState<PriceComparisonSummary | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
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
      const fetchedProducts: RetailerDeal[] = data.products || [];

      setDeals(fetchedProducts);

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

  // Automatically trigger search if query is passed via URL parameters
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
      handleSearch(urlQuery);
    }
  }, [urlQuery]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <div className="py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchQuery);
          }}
          className="mx-auto max-w-2xl relative rounded-full shadow-md border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden flex items-center p-2"
        >
          <Search className="text-slate-400 ml-3" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products across all stores..."
            className="w-full px-4 py-2 text-slate-900 dark:text-white bg-transparent focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 size={40} className="animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Fetching live deals for "{searchQuery}"...
          </p>
        </div>
      )}

      {/* Dynamic Price Comparison Table */}
      {!loading && searched && comparisonSummary && (
        <section className="mt-8 mb-12">
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
      {!loading && searched && deals.length === 0 && (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 my-8">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No valid deals found for "{searchQuery}". Try another search term!
          </p>
        </div>
      )}

      {/* Grid Content: Individual Store Deal Cards */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {deals.length > 0 ? 'Individual Store Deals' : 'Results'}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {deals.map((deal, idx) => (
            <ProductCard
              key={idx}
              id={String(idx + 1)}
              title={deal.title}
              category={deal.retailerName}
              lowestPrice={deal.price}
              storesCount={1}
              imageUrl={deal.imageUrl}
              productUrl={deal.productUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20">
          <Loader2 size={40} className="animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-slate-600 font-medium">Loading search interface...</p>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}