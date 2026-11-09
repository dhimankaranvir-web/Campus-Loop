import React from 'react';
import { ShieldCheck, Star, Lock, MapPin, Award, CheckCircle2, UserCheck, HeartHandshake } from 'lucide-react';
import { Product } from '../types.ts';

interface CommunityTrustProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenSellModal: () => void;
}

export const CommunityTrustSection: React.FC<CommunityTrustProps> = ({
  products,
  onSelectProduct,
  onOpenSellModal,
}) => {
  // Aggregate all reviews across products
  const allReviews = products
    .flatMap((p) =>
      (p.reviews || []).map((r) => ({
        ...r,
        productTitle: p.title,
        productCategory: p.category,
        productImage: p.image,
      }))
    )
    .slice(0, 6);

  // Top sellers
  const topSellers = [
    {
      name: 'David Zhao',
      major: 'CS & Math',
      year: "'25 Senior",
      rating: 4.9,
      sales: 34,
      campus: 'North Quad Dorms',
      specialty: 'STEM Textbooks & Calculators',
      verified: true,
    },
    {
      name: 'Elena Rostova',
      major: 'Architecture',
      year: "'25 Senior",
      rating: 4.8,
      sales: 19,
      campus: 'Unit 2 - Wada',
      specialty: 'Study Desks & Ergonomic Chairs',
      verified: true,
    },
    {
      name: 'Kenji Sato',
      major: 'Haas Business',
      year: "'26 Undergrad",
      rating: 5.0,
      sales: 42,
      campus: 'Foothill Suites',
      specialty: 'Dorm Kitchenware & Rice Cookers',
      verified: true,
    },
    {
      name: 'Amara Okafor',
      major: 'MCB Pre-Med',
      year: "'25 Senior",
      rating: 4.9,
      sales: 27,
      campus: 'International House',
      specialty: 'Biology Books & Desk Lamps',
      verified: true,
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Campus Integrity & Community Rating Standards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          Peer Trust & Verified Student Ratings
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          We protect student buyers and sellers from Craigslist scams and bookstore price-gouging through campus identity verification, escrow payouts, and verified dorm reviews.
        </p>
      </div>

      {/* Escrow Guarantee Infographic */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-stone-900">.edu Student Verification</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every seller and buyer is verified with their official university credentials and campus residence hall.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-stone-900">Contactless Campus Lockers</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Sellers place items in 24/7 smart lockers in the Student Union or North Quad. No awkward off-campus meetups.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-stone-900">Automatic Escrow Hold</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Funds are held securely by Campus Loop until the buyer retrieves the item and verifies it matches the description.
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h3 className="text-sm font-bold text-stone-900">Community Star Ratings</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Both parties leave authentic reviews. High rating sellers earn zero-fee badges and preferred placement.
          </p>
        </div>
      </div>

      {/* Top Student Sellers Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-800" />
            <span>Top Rated Student Sellers This Term</span>
          </h2>
          <button
            onClick={onOpenSellModal}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900"
          >
            Become a Verified Seller →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topSellers.map((seller, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900">{seller.name}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-stone-500">
                    {seller.major} · {seller.year}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{seller.rating}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Verified Sales:</span>
                  <span className="font-semibold text-stone-800">{seller.sales} items</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Spot:</span>
                  <span className="font-semibold text-stone-800 truncate max-w-[120px]">
                    {seller.campus}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-[11px] text-amber-800 font-medium">
                    Specialty: {seller.specialty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Student Feedback Wall */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-700" />
          <span>Real Campus Purchase Reviews</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-white rounded-xl border border-stone-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">
                    {rev.authorName} ({rev.dormLocation || 'Campus'})
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
                <img
                  src={rev.productImage}
                  alt={rev.productTitle}
                  className="w-8 h-8 rounded object-cover border border-stone-200"
                />
                <span className="truncate flex-1 font-medium text-stone-800">
                  {rev.productTitle}
                </span>
                <span className="text-[10px] text-stone-400 shrink-0">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Safety Notice */}
      <div className="p-6 bg-stone-900 text-stone-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <span>Built by Students, for Students</span>
          </h3>
          <p className="text-xs text-stone-400 max-w-xl">
            100% of marketplace payments remain in escrow until you open the locker or meet the seller. If an item doesn't match the condition listed, full immediate refund is guaranteed.
          </p>
        </div>

        <button
          onClick={onOpenSellModal}
          className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          List Pre-Loved Item ($0 Fees)
        </button>
      </div>
    </div>
  );
};
