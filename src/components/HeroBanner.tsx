import React from 'react';
import { BookOpen, Armchair, CookingPot, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { heroLivingImg } from '../data/mockData.ts';
import { ProductCategory } from '../types.ts';

interface HeroBannerProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenDormChef: () => void;
  onOpenSellModal: () => void;
  selectedCategory: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenDormChef,
  onOpenSellModal,
  selectedCategory,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Mission, Value Prop & Fast Categories */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified .edu Campus Marketplace
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-600">
                <MapPin className="w-3.5 h-3.5" />
                Direct Dorm & Locker Handoffs
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15] text-balance">
              Dorm living made affordable. <br className="hidden sm:inline" />
              <span className="text-amber-800">Buy & sell without campus bookstore markups.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
              Find pre-loved STEM & humanities textbooks, sturdy study desks, air fryers, and rice cookers from fellow students in your halls. Plus, build custom dorm meals with our interactive kitchen builder.
            </p>

            {/* Category Quick Filter Strips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => onSelectCategory('textbooks')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  selectedCategory === 'textbooks'
                    ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Textbooks (Save up to 85%)</span>
              </button>

              <button
                onClick={() => onSelectCategory('furniture')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  selectedCategory === 'furniture'
                    ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <Armchair className="w-4 h-4" />
                <span>Dorm Desks & Chairs</span>
              </button>

              <button
                onClick={() => onSelectCategory('kitchenware')}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  selectedCategory === 'kitchenware'
                    ? 'bg-amber-800 text-white border-amber-900 shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <CookingPot className="w-4 h-4" />
                <span>Cookware & Appliances</span>
              </button>

              <button
                onClick={onOpenDormChef}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>Dorm Chef Pot & Recipes</span>
              </button>
            </div>

            {/* Quick Proof Metrics Row */}
            <div className="pt-4 border-t border-stone-100 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <p className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">$420+</p>
                <p className="text-xs text-stone-500">Avg. Semester Savings</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">2,400+</p>
                <p className="text-xs text-stone-500">Verified Campus Peers</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-stone-900 tabular-nums">15 mins</p>
                <p className="text-xs text-stone-500">Avg. Locker Dropoff</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-100 group">
              <img
                src={heroLivingImg}
                alt="Student study room with desk, books, and kitchen essentials"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-84 lg:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-medium uppercase tracking-wider text-amber-200">
                  Student Spotlights
                </span>
                <p className="text-sm font-semibold mt-1">
                  Moving out or taking new classes? Pass on your dorm gear securely.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={onOpenSellModal}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold transition-colors"
                  >
                    Post an Item for Sale
                  </button>
                  <span className="text-xs text-stone-200">
                    No listing fees · Escrow protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
