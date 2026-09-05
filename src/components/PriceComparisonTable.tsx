'use client';

import React from 'react';
import { PriceComparisonSummary } from '@/lib/comparisonEngine';
import { ExternalLink, CheckCircle2, Sparkles, ShoppingBag, Truck } from 'lucide-react';

interface Props {
  summary: PriceComparisonSummary;
}

// Exchange rate formula multiplier ($1 USD to £ GBP)
const USD_TO_GBP = 0.78;

function formatGBP(amountInUSD: number): string {
  const converted = amountInUSD * USD_TO_GBP;
  return `£${converted.toFixed(2)}`;
}

export default function PriceComparisonTable({ summary }: Props) {
  const { deals, cheapestDeal, potentialSavings } = summary;

  // Custom styling helper for popular retailer badges
  const getRetailerBadge = (name: string) => {
    const store = name.toUpperCase();
    if (store.includes('AMAZON')) {
      return { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
    }
    if (store.includes('EBAY')) {
      return { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }
    if (store.includes('WALMART')) {
      return { bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' };
    }
    if (store.includes('ALIEXPRESS')) {
      return { bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' };
    }
    return { bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
  };

  return (
    <div className="space-y-5">
      {/* Savings Highlight Banner */}
      {potentialSavings > 0 && (
        <div className="relative overflow-hidden p-4 md:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                  Best Value Found
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  Top Deal
                </span>
              </div>
              <p className="text-xs md:text-sm text-emerald-800 dark:text-emerald-300 mt-0.5">
                Save up to <span className="font-black">{formatGBP(potentialSavings)}</span> by selecting the lowest priced retailer below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <th className="py-4 px-5">Retailer</th>
                <th className="py-4 px-5">Product Title</th>
                <th className="py-4 px-5">Item Price</th>
                <th className="py-4 px-5">Delivery</th>
                <th className="py-4 px-5">Total Price</th>
                <th className="py-4 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {deals.map((deal, idx) => {
                const isCheapest =
                  cheapestDeal?.retailerName === deal.retailerName &&
                  cheapestDeal?.price === deal.price;
                const total = deal.price + (deal.deliveryCharges || 0);
                const badgeStyle = getRetailerBadge(deal.retailerName);

                return (
                  <tr
                    key={idx}
                    className={`group transition-all hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
                      isCheapest
                        ? 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]'
                        : ''
                    }`}
                  >
                    {/* Retailer Name & Status */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${badgeStyle.bg}`}
                        >
                          <ShoppingBag size={12} />
                          {deal.retailerName}
                        </span>
                        {isCheapest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                            <CheckCircle2 size={11} /> Lowest Price
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product Title & Image */}
                    <td className="py-4 px-5 max-w-xs md:max-w-sm">
                      <div className="flex items-center gap-3">
                        {deal.imageUrl ? (
                          <div className="w-11 h-11 rounded-lg border border-slate-200 dark:border-slate-800 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={deal.imageUrl}
                              alt={deal.title}
                              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                            />
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center text-slate-400">
                            <ShoppingBag size={18} />
                          </div>
                        )}
                        <span
                          className="font-medium text-slate-800 dark:text-slate-200 line-clamp-2 text-xs md:text-sm leading-snug"
                          title={deal.title}
                        >
                          {deal.title}
                        </span>
                      </div>
                    </td>

                    {/* Base Price */}
                    <td className="py-4 px-5 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                      {formatGBP(deal.price)}
                    </td>

                    {/* Delivery Fee */}
                    <td className="py-4 px-5 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                      {deal.deliveryCharges === 0 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                          <Truck size={12} /> FREE
                        </span>
                      ) : (
                        `+${formatGBP(deal.deliveryCharges)}`
                      )}
                    </td>

                    {/* Total Price */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`text-base font-extrabold ${
                          isCheapest
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-950 dark:text-white'
                        }`}
                      >
                        {formatGBP(total)}
                      </span>
                    </td>

                    {/* Direct View Deal CTA */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <a
                        href={deal.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                          isCheapest
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                        }`}
                      >
                        View Deal
                        <ExternalLink size={13} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}