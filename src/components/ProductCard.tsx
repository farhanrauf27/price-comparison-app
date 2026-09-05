'use client';

import React from 'react';
import { ExternalLink, ShoppingBag, ArrowUpRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  category: string;
  lowestPrice: number;
  storesCount: number;
  imageUrl?: string;
  productUrl?: string;
}

// Currency Conversion ($1 USD = £0.78 GBP)
const USD_TO_GBP = 0.78;

function formatGBP(amountInUSD: number): string {
  const converted = amountInUSD * USD_TO_GBP;
  return `£${converted.toFixed(2)}`;
}

export default function ProductCard({
  title,
  category,
  lowestPrice,
  storesCount,
  imageUrl,
  productUrl,
}: ProductCardProps) {
  // Retailer-specific badge style generator
  const getBadgeStyle = (name: string) => {
    const store = name.toUpperCase();
    if (store.includes('AMAZON')) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    if (store.includes('EBAY')) {
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
    if (store.includes('WALMART')) {
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
    }
    if (store.includes('ALIEXPRESS')) {
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    }
    return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
  };

  const badgeClass = getBadgeStyle(category);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-2xl/50">
      
      {/* Top Image & Title Area */}
      <div>
        {/* Image Container with Zoom Effect */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors group-hover:bg-white dark:border-slate-800/60 dark:bg-slate-800/40 dark:group-hover:bg-slate-800/80">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80'}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Floating Retailer Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${badgeClass}`}>
              <ShoppingBag size={11} />
              {category}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <div className="mt-4">
          <h3
            className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug transition-colors group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400"
            title={title}
          >
            {title}
          </h3>
        </div>
      </div>

      {/* Bottom Pricing & Action Section */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Price
          </span>
          <p className="text-lg font-black text-slate-950 dark:text-white">
            {formatGBP(lowestPrice)}
          </p>
        </div>

        {/* Direct Action Link */}
        {productUrl ? (
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/30 active:scale-95"
          >
            <span>Visit Deal</span>
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            <Sparkles size={12} className="text-indigo-500" />
            {storesCount} Stores
          </span>
        )}
      </div>
    </div>
  );
}