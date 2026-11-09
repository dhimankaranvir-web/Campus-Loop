import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, DollarSign, Check } from 'lucide-react';
import { ProductCategory, ProductCondition } from '../types.ts';

interface FilterState {
  searchQuery: string;
  category: ProductCategory | 'all';
  subcategory: string;
  maxPrice: number;
  condition: ProductCondition | 'all';
  sortBy: 'price-low' | 'price-high' | 'rating' | 'newest';
  onlyVerifiedSellers: boolean;
  onlyUnder25: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalResultsCount,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories: { label: string; value: ProductCategory | 'all' }[] = [
    { label: 'All Categories', value: 'all' },
    { label: 'Textbooks', value: 'textbooks' },
    { label: 'Furniture', value: 'furniture' },
    { label: 'Kitchenware', value: 'kitchenware' },
  ];

  const conditions: { label: string; value: ProductCondition | 'all' }[] = [
    { label: 'Any Condition', value: 'all' },
    { label: 'Like New', value: 'Like New' },
    { label: 'Good', value: 'Good' },
    { label: 'Acceptable', value: 'Acceptable' },
  ];

  const sortOptions = [
    { label: 'Price: Low to High', value: 'price-low' as const },
    { label: 'Price: High to Low', value: 'price-high' as const },
    { label: 'Highest Seller Rating', value: 'rating' as const },
    { label: 'Newest Listings', value: 'newest' as const },
  ];

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.maxPrice < 100 ||
    filters.condition !== 'all' ||
    filters.onlyVerifiedSellers ||
    filters.onlyUnder25;

  return (
    <div className="bg-white border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Row 1: Search bar, Category Buttons & Filter Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search textbooks (Calculus, Bio), desk, rice cooker, blender..."
              value={filters.searchQuery}
              onChange={(e) =>
                onChangeFilters({ ...filters, searchQuery: e.target.value })
              }
              className="w-full pl-10 pr-9 py-2 text-sm bg-stone-50 hover:bg-stone-100/80 focus:bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => onChangeFilters({ ...filters, category: cat.value })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                  filters.category === cat.value
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Controls toggle button on mobile & sort selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                showMobileFilters || isFiltered
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-amber-600 inline-block ml-0.5" />
              )}
            </button>

            {/* Sort selector */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onChangeFilters({
                    ...filters,
                    sortBy: e.target.value as FilterState['sortBy'],
                  })
                }
                className="pl-7 pr-8 py-2 text-xs font-medium bg-white border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:border-stone-400 appearance-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer / Section */}
        {showMobileFilters && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-150">
            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Item Condition
              </label>
              <div className="flex flex-wrap gap-1">
                {conditions.map((cond) => (
                  <button
                    key={cond.value}
                    onClick={() =>
                      onChangeFilters({ ...filters, condition: cond.value })
                    }
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      filters.condition === cond.value
                        ? 'bg-amber-800 text-white border-amber-800'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
                <span>Max Price Budget</span>
                <span className="font-mono text-stone-900">${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={filters.maxPrice}
                onChange={(e) =>
                  onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
                className="w-full accent-amber-800 h-1.5 bg-stone-200 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>$10</span>
                <span>$50</span>
                <span>$100+</span>
              </div>
            </div>

            {/* Fast Student Toggles */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-stone-600">
                Safety & Affordability
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={filters.onlyVerifiedSellers}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      onlyVerifiedSellers: e.target.checked,
                    })
                  }
                  className="rounded text-amber-800 focus:ring-amber-800 w-3.5 h-3.5"
                />
                <span>Verified .edu Sellers Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={filters.onlyUnder25}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      onlyUnder25: e.target.checked,
                    })
                  }
                  className="rounded text-amber-800 focus:ring-amber-800 w-3.5 h-3.5"
                />
                <span>Under $25 Bargain Finds</span>
              </label>
            </div>

            {/* Reset / Results Count */}
            <div className="flex flex-col justify-end items-start sm:items-end">
              <p className="text-xs text-stone-500 mb-2">
                Showing <span className="font-semibold text-stone-800">{totalResultsCount}</span> campus items
              </p>
              {isFiltered && (
                <button
                  onClick={onResetFilters}
                  className="text-xs text-amber-900 hover:text-amber-950 font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Clear All Filters</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
