import React, { useState } from 'react';
import { X, Upload, ShieldCheck, DollarSign, BookOpen, Armchair, CookingPot, Check } from 'lucide-react';
import { Product, ProductCategory, ProductCondition, UserAccount } from '../types.ts';
import { productDeskImg, productKitchenwareImg, productTextbookImg, heroLivingImg } from '../data/mockData.ts';

interface ListProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => void;
  user: UserAccount;
}

export const ListProductModal: React.FC<ListProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
  user,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('textbooks');
  const [subcategory, setSubcategory] = useState('Math & STEM');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Good');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(user.dormBuilding ? `${user.dormBuilding} or Student Union` : 'Campus Library');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [isbn, setIsbn] = useState('');
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(productTextbookImg);
  const [safetyAgreed, setSafetyAgreed] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    // Determine default image preset based on category if not selected
    let finalImage = selectedImagePreset;
    if (!finalImage) {
      if (category === 'textbooks') finalImage = productTextbookImg;
      else if (category === 'furniture') finalImage = productDeskImg;
      else if (category === 'kitchenware') finalImage = productKitchenwareImg;
      else finalImage = heroLivingImg;
    }

    const newProduct: Product = {
      id: `prod_user_${Date.now()}`,
      title,
      category,
      subcategory: subcategory || 'Campus Item',
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      condition,
      image: finalImage,
      seller: {
        id: user.id,
        name: user.name,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        campus: user.dormBuilding || 'Campus Dorms',
        university: user.university,
        rating: 5.0,
        reviewsCount: 1,
        isEduVerified: user.isEduVerified,
        graduationYear: "'26 Undergrad",
        responseTime: '< 10 mins',
      },
      description,
      location,
      isNegotiable,
      isbn: isbn || undefined,
      inStock: true,
      stockCount: 1,
      tags: [category, condition, subcategory],
      dateAdded: 'Just now',
      distanceMiles: 0.1,
      reviews: [],
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-bold text-stone-900">List an Item for Campus Sale</h2>
            <p className="text-xs text-stone-500">
              Zero seller commission. Hand-off safely to fellow {user.university} students.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Select Category
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setCategory('textbooks');
                  setSubcategory('STEM & Math');
                  setSelectedImagePreset(productTextbookImg);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  category === 'textbooks'
                    ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Textbook</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('furniture');
                  setSubcategory('Desks & Chairs');
                  setSelectedImagePreset(productDeskImg);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  category === 'furniture'
                    ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Armchair className="w-4 h-4" />
                <span>Furniture</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('kitchenware');
                  setSubcategory('Cookware & Appliances');
                  setSelectedImagePreset(productKitchenwareImg);
                }}
                className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-semibold transition-all ${
                  category === 'kitchenware'
                    ? 'border-amber-800 bg-amber-50 text-amber-900 ring-1 ring-amber-800'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <CookingPot className="w-4 h-4" />
                <span>Kitchenware</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Listing Title
            </label>
            <input
              type="text"
              placeholder="e.g. Stewart Calculus 9th Edition or Compact Oak Study Desk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800"
              required
            />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Price ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="25"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Original Retail / Bookstore Price (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="140"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full pl-6 pr-3 py-2 text-xs border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>
          </div>

          {/* Condition & Subcategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ProductCondition)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
              >
                <option value="Brand New">Brand New (Unopened)</option>
                <option value="Like New">Like New (Mint / Barely Used)</option>
                <option value="Good">Good (Minor wear / clean notes)</option>
                <option value="Acceptable">Acceptable (Noticeable wear)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Subcategory / Field
              </label>
              <input
                type="text"
                placeholder="e.g. CS 61B, Bio, Lighting, Pans"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
              />
            </div>
          </div>

          {/* ISBN for Textbooks */}
          {category === 'textbooks' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                ISBN-10 or ISBN-13 (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 978-0134685991"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg font-mono"
              />
            </div>
          )}

          {/* Hand-off Location */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Campus Hand-off Spot
            </label>
            <input
              type="text"
              placeholder="e.g. MLK Student Union, Moffitt Library, or Unit 1 Courtyard"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description & Notes for Student Buyers
            </label>
            <textarea
              rows={3}
              placeholder="Mention edition, highlighting, course code, included cables or parts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg resize-none"
              required
            />
          </div>

          {/* Select Photography Preset */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Select High-Quality Item Photo
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { img: productTextbookImg, label: 'Textbooks' },
                { img: productDeskImg, label: 'Desk / Lamp' },
                { img: productKitchenwareImg, label: 'Cookware' },
                { img: heroLivingImg, label: 'Dorm Chair / Space' },
              ].map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImagePreset(p.img)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImagePreset === p.img
                      ? 'border-amber-800 ring-2 ring-amber-800/30'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img src={p.img} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] py-0.5 text-center">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Negotiation Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="rounded text-amber-800 focus:ring-amber-800 w-4 h-4"
              />
              <span>Open to price counter-offers from fellow students</span>
            </label>
          </div>

          {/* Safety Code Checklist */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">Campus Escrow Protection:</span>
              <p className="mt-0.5">
                Buyer payment is held safely until they confirm receipt at the campus locker or hand-off. No stranger meetups off-campus.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Publish Campus Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
