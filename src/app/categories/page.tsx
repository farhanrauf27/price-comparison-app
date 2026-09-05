import Link from 'next/link';
import { Laptop, Smartphone, Headphones, Watch, Shirt, Home } from 'lucide-react';

const categories = [
  { name: 'Electronics', slug: 'electronics', count: 1420, icon: Laptop, color: 'bg-blue-50 text-blue-600' },
  { name: 'Smartphones', slug: 'smartphones', count: 840, icon: Smartphone, color: 'bg-green-50 text-green-600' },
  { name: 'Audio & Sound', slug: 'audio', count: 610, icon: Headphones, color: 'bg-purple-50 text-purple-600' },
  { name: 'Wearables', slug: 'wearables', count: 320, icon: Watch, color: 'bg-amber-50 text-amber-700' },
  { name: 'Fashion & Apparel', slug: 'fashion', count: 2150, icon: Shirt, color: 'bg-pink-50 text-pink-600' },
  { name: 'Home Appliances', slug: 'home-appliances', count: 980, icon: Home, color: 'bg-teal-50 text-teal-600' },
];

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Browse by Category</h1>
        <p className="text-sm text-slate-500 mt-1">Explore aggregated pricing trends across major industries</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <Link key={cat.slug} href={`/search?category=${cat.slug}`} className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 flex items-center gap-5">
              <div className={`p-4 rounded-xl ${cat.color} group-hover:scale-105 transition-transform`}>
                <IconComponent size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{cat.count} Products Available</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}