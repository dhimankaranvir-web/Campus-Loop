import React, { useState } from 'react';
import { X, Star, ShieldCheck, MapPin, Clock, ArrowRight, MessageCircle, Send } from 'lucide-react';
import { Product, Review } from '../types.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'productId'>) => void;
  currentUserUniversity: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onAddReview,
  currentUserUniversity,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerSent, setOfferSent] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('Campus Student');

  if (!product) return null;

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerPrice) return;
    setOfferSent(true);
    setTimeout(() => {
      setShowOfferInput(false);
    }, 2500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddReview(product.id, {
      authorName: reviewerName,
      authorCampus: currentUserUniversity,
      rating: newRating,
      date: 'Just now',
      comment: newComment.trim(),
      verifiedPurchase: true,
      dormLocation: 'Campus Dorms',
    });

    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-800 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image & Seller Card (md:col-span-6) */}
          <div className="md:col-span-6 bg-stone-50 border-r border-stone-200 p-5 flex flex-col justify-between">
            <div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-white">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-stone-900 text-white text-xs font-semibold px-2.5 py-1 rounded">
                    {product.condition}
                  </span>
                  {discountPct > 0 && (
                    <span className="bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      Save {discountPct}%
                    </span>
                  )}
                </div>
              </div>

              {/* Seller Trust Profile */}
              <div className="mt-5 p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                  Seller & Campus Verification
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-stone-900 truncate">
                        {product.seller.name}
                      </span>
                      {product.seller.isEduVerified && (
                        <span className="flex items-center gap-0.5 text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          .edu verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500">
                      {product.seller.graduationYear || product.seller.university} · {product.seller.campus}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-stone-400">Reputation</span>
                    <p className="font-semibold text-stone-800 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{product.seller.rating} / 5.0</span>
                      <span className="text-stone-400">({product.seller.reviewsCount})</span>
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-400">Response Speed</span>
                    <p className="font-semibold text-stone-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{product.seller.responseTime}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hand-off location badge */}
            <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-950 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Safe Campus Hand-off: </span>
                <span>{product.location}</span>
                <p className="text-stone-600 mt-0.5">
                  Meet in public campus locations or use 24/7 student locker pick-up.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Tabs (md:col-span-6) */}
          <div className="md:col-span-6 p-6 flex flex-col justify-between">
            <div>
              {/* Category & ISBN */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span className="font-semibold text-amber-800 uppercase tracking-wider">
                  {product.category}
                </span>
                <span aria-hidden="true">·</span>
                <span>{product.subcategory}</span>
                {product.isbn && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-stone-600">ISBN: {product.isbn}</span>
                  </>
                )}
              </div>

              <h2 className="text-xl font-bold text-stone-900 mt-2 leading-snug">
                {product.title}
              </h2>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-stone-900 tabular-nums">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    Bookstore Price: ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Tabs: Details vs Community Reviews */}
              <div className="flex items-center gap-4 border-b border-stone-200 mt-5 text-sm">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 font-semibold transition-colors border-b-2 ${
                    activeTab === 'details'
                      ? 'border-amber-800 text-stone-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Description & Specs
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'reviews'
                      ? 'border-amber-800 text-stone-900'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <span>Student Reviews</span>
                  <span className="text-xs bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-mono">
                    {product.reviews?.length || 0}
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' ? (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-stone-600 bg-stone-100 px-2 py-0.5 rounded font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Make an offer toggle */}
                  {product.isNegotiable && (
                    <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
                      {!showOfferInput ? (
                        <button
                          onClick={() => setShowOfferInput(true)}
                          className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Make a Counter-Offer to Seller</span>
                        </button>
                      ) : offerSent ? (
                        <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                          <span>✓ Offer of ${offerPrice} submitted! Seller notified.</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSendOffer} className="space-y-2">
                          <label className="block text-xs font-semibold text-stone-700">
                            Propose price (Current: ${product.price})
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="1"
                              placeholder="e.g. 20"
                              value={offerPrice}
                              onChange={(e) => setOfferPrice(e.target.value)}
                              className="w-24 px-2 py-1 text-xs border border-stone-300 rounded font-mono"
                              required
                            />
                            <button
                              type="submit"
                              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Submit Offer</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowOfferInput(false)}
                              className="text-xs text-stone-500 hover:text-stone-700 px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {/* Reviews List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {(!product.reviews || product.reviews.length === 0) ? (
                      <p className="text-xs text-stone-500 py-4 text-center">
                        No reviews yet for this listing. Be the first student buyer to review!
                      </p>
                    ) : (
                      product.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900">
                              {rev.authorName} · {rev.dormLocation || rev.authorCampus}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < rev.rating
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-stone-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-stone-600 leading-normal">{rev.comment}</p>
                          <span className="text-[10px] text-stone-400">{rev.date}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Review Form */}
                  <form onSubmit={handleReviewSubmit} className="pt-3 border-t border-stone-100 space-y-2">
                    <p className="text-xs font-bold text-stone-800">Leave a Community Review</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-600">Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setNewRating(s)}
                            className="p-0.5"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                s <= newRating
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Your name or initials"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded"
                    />
                    <textarea
                      placeholder="How was the condition & campus hand-off?"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-200 rounded resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded"
                    >
                      Post Review
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-stone-200 flex items-center gap-3">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-xs rounded-xl transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  onBuyNow(product);
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
