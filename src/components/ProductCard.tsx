import React from 'react';
import { Star, MapPin, Plus, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
}) => {
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Product Image Frame */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Condition tag: clean subtle tag, not a heavy sandwich */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-xs">
            {product.condition}
          </span>
          {discountPct > 0 && (
            <span className="bg-emerald-700/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Campus distance indicator */}
        {product.distanceMiles !== undefined && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-300" />
            <span>{product.distanceMiles} mi from dorm</span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <span className="uppercase tracking-wider text-[11px] text-amber-800 font-semibold">
              {product.subcategory}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.location.split('(')[0]}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-sm font-semibold text-stone-900 mt-1.5 line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Seller Trust Snippet */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-2">
            <span className="font-medium truncate">{product.seller.name}</span>
            {product.seller.isEduVerified && (
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                .edu
              </span>
            )}
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="flex items-center gap-0.5 text-stone-700 font-medium">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500 inline" />
              <span>{product.seller.rating}</span>
              <span className="text-stone-400">({product.seller.reviewsCount})</span>
            </span>
          </div>
        </div>

        {/* Pricing & Add Action Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-stone-900 tabular-nums">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.isNegotiable && (
              <span className="text-[10px] text-stone-500">Open to offers</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenDetails(product)}
              className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold rounded transition-colors shadow-xs"
              aria-label={`Add ${product.title} to cart`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
