'use client';

import React from 'react';
import { FilterState, SortOption } from '@/types/shopping';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (updated: FilterState) => void;
  availableStores: string[];
  availableBrands: string[];
  onReset: () => void;
}

export function FilterPanel({
  filters,
  onChange,
  availableStores,
  availableBrands,
  onReset,
}: FilterPanelProps) {
  const handleStoreToggle = (store: string) => {
    const updated = filters.stores.includes(store)
      ? filters.stores.filter(s => s !== store)
      : [...filters.stores, store];
    onChange({ ...filters, stores: updated });
  };

  const handleBrandToggle = (brand: string) => {
    const updated = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onChange({ ...filters, brands: updated });
  };

  return (
    <aside className="w-full lg:w-64 bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
        <button
          onClick={onReset}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          Reset All
        </button>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={e => onChange({ ...filters, sortBy: e.target.value as SortOption })}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg text-sm p-2.5 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="cheapest">Cheapest First</option>
          <option value="most_expensive">Most Expensive</option>
          <option value="highest_rating">Highest Rating</option>
          <option value="best_match">Best Match</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Price Range (${filters.minPrice} - ${filters.maxPrice})
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={e => onChange({ ...filters, minPrice: Number(e.target.value) })}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
            placeholder="Min"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-1/2 p-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Minimum Rating ({filters.minRating}★)
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={e => onChange({ ...filters, minRating: Number(e.target.value) })}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* Stores */}
      {availableStores.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Store
          </label>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {availableStores.map(store => (
              <label key={store} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.stores.includes(store)}
                  onChange={() => handleStoreToggle(store)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>{store}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={e => onChange({ ...filters, onlyAvailable: e.target.checked })}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}