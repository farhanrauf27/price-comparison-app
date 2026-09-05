'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Footer from '@/components/Footer';
import { calculatePriceComparison, PriceComparisonSummary, RetailerDeal } from '@/lib/comparisonEngine';
import { 
  Search, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  Store, 
  BarChart3, 
  CheckCircle2, 
  X,
  Layers,
  Globe2
} from 'lucide-react';

const QUICK_SEARCHES = ['iPhone 15 Pro', 'Sony WH-1000XM5', 'MacBook Air M3', 'PlayStation 5', 'AirPods Pro'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
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

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-3xl animate-pulse" />
        <div className="absolute top-10 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl" />
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* HERO SECTION */}
        <div className="text-center py-10 md:py-16 transition-all duration-500">
          
          {/* Real-Time Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 backdrop-blur-md animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Real-Time Cross-Store Price Aggregator
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl md:text-7xl dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Never Overpay Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500">Major Retailers</span> Again.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Aggregate verified, live pricing directly across Amazon, eBay, Walmart, AliExpress, and leading storefronts in a single unified breakdown table.
          </p>

          {/* SEARCH BAR CONTAINER */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }}
            className="group relative mx-auto mt-8 max-w-2xl"
          >
            {/* Focus Ambient Backlight Glow */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-0 blur-md transition-all duration-500 group-focus-within:opacity-70 dark:group-focus-within:opacity-50" />

            {/* Input Wrapper */}
            <div className="relative flex items-center rounded-full border border-slate-200/80 bg-white/90 p-2 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-2xl">
              <div className="ml-3.5 flex shrink-0 items-center justify-center text-slate-400 transition-colors duration-200 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400">
                <Search size={22} />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products (e.g., iPhone 15 Pro, Sony WH-1000XM5)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white dark:placeholder-slate-500 md:text-base"
              />

              {searchQuery && !loading && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-1 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-600/25 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Comparing...</span>
                  </>
                ) : (
                  <>
                    <span>Compare</span>
                    <Sparkles size={16} className="transition-transform group-hover:rotate-12" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Popular Searches:</span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  handleSearch(term);
                }}
                className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 shadow-xs hover:shadow-sm"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Live Store Stats Ticker */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-xs font-semibold text-slate-500 dark:text-slate-400 border-y border-slate-200/60 dark:border-slate-800/60 py-3.5 max-w-3xl mx-auto">
            <span className="flex items-center gap-1.5">
              <Store size={15} className="text-amber-500" /> Amazon Live Search
            </span>
            <span className="flex items-center gap-1.5">
              <Store size={15} className="text-blue-500" /> eBay Direct API
            </span>
            <span className="flex items-center gap-1.5">
              <Store size={15} className="text-sky-500" /> Walmart Structured Engine
            </span>
            <span className="flex items-center gap-1.5">
              <Store size={15} className="text-orange-500" /> AliExpress Wholesale
            </span>
          </div>
        </div>

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div className="space-y-6 my-8 animate-pulse">
            <div className="text-center py-6">
              <Loader2 size={38} className="animate-spin mx-auto text-indigo-600 mb-3" />
              <p className="text-slate-700 dark:text-slate-300 font-bold text-base">
                Extracting live prices across Amazon, eBay, Walmart, and AliExpress...
              </p>
              <p className="text-xs text-slate-400 mt-1">Filtering out broken links and verifying direct item specifications</p>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* PRICE COMPARISON TABLE RESULTS */}
        {!loading && searched && comparisonSummary && (
          <section className="mt-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Price Breakdown for "{searchQuery}"
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Retrieved {comparisonSummary.totalRetailersCompared} active retailer deals matching your query
                </p>
              </div>
            </div>

            <PriceComparisonTable summary={comparisonSummary} />
          </section>
        )}

        {/* INDIVIDUAL STORE CARDS */}
        {!loading && searched && deals.length > 0 && (
          <section className="mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
              Individual Store Offer Details
            </h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
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
          </section>
        )}

        {/* EMPTY STATE */}
        {!loading && searched && deals.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 my-8 shadow-sm max-w-2xl mx-auto">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <Search size={28} />
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-extrabold text-lg">
              No live deals retrieved for "{searchQuery}"
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto">
              Ensure terms are spelled correctly or try searching for a brand name (e.g., "AirPods Pro" instead of general terms).
            </p>
          </div>
        )}

        {/* LANDING PAGE VALUE PROPOSITION & HOW IT WORKS (Shown Before Search) */}
        {!searched && (
          <div className="space-y-16 mt-8">
            {/* Feature Showcase Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
              <div className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-5 w-fit group-hover:scale-110 transition-transform">
                  <Zap size={26} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Real-Time Price Sync</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Queries active search APIs directly to grab real live listings, removing stale cached prices.
                </p>
              </div>

              <div className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-5 w-fit group-hover:scale-110 transition-transform">
                  <TrendingDown size={26} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Savings Calculator</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Automatically isolates the cheapest offer and calculates potential savings in £ GBP.
                </p>
              </div>

              <div className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-5 w-fit group-hover:scale-110 transition-transform">
                  <ShieldCheck size={26} />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Direct Item URLs</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Every button routes straight to canonical product specification pages (`/dp/`, `/itm/`, `/ip/`).
                </p>
              </div>
            </section>

            {/* How It Works Pipeline */}
            <section className="py-12 border-t border-slate-200 dark:border-slate-800">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white">How It Works in 3 Simple Steps</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Get verified price comparison data without switching browser tabs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-indigo-600/20">
                    1
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Enter Your Query</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Type any product name or model into the search bar above to trigger the cross-store aggregator.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-indigo-600/20">
                    2
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Parallel Aggregation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Our backend queries active search endpoints across Amazon, eBay, Walmart, and AliExpress simultaneously.
                  </p>
                </div>

                <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-lg mb-4 shadow-md shadow-indigo-600/20">
                    3
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">Pick the Lowest Price</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Review converted £ prices in the comparison breakdown table and click "View Deal" to buy directly.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* FOOTER INTEGRATION */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8">
          <Footer />
        </div>
      </main>
    </div>
  );
}