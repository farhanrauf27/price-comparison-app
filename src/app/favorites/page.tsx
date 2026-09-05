import ProductCard from '@/components/ProductCard';
import { Bell } from 'lucide-react';

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-slate-200 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Your Watchlist</h1>
          <p className="text-sm text-slate-500 mt-1">Products you are currently tracking for price drops</p>
        </div>
        <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Bell size={14} /> 2 Active Alerts
        </span>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard id="1" title="iPhone 15 Pro Max - 250GB" category="Electronics" lowestPrice={999.00} storesCount={4} />
        <ProductCard id="2" title="Sony WH-1000XM5 Headphones" category="Audio" lowestPrice={348.00} storesCount={3} />
      </div>
    </main>
  );
}