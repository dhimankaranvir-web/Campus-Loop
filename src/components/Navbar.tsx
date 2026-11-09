import React, { useState } from 'react';
import { ShoppingBag, Bell, User, Plus, Menu, X, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types.ts';

interface NavbarProps {
  activeTab: 'marketplace' | 'dorm-chef' | 'subscriptions' | 'community';
  onSelectTab: (tab: 'marketplace' | 'dorm-chef' | 'subscriptions' | 'community') => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSellModal: () => void;
  onOpenAccountModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  user: UserAccount;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenSellModal,
  onOpenAccountModal,
  onOpenNotifications,
  unreadNotificationsCount,
  user,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'marketplace' | 'dorm-chef' | 'subscriptions' | 'community') => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('marketplace')}
              className="text-xl font-bold tracking-tight text-stone-900 hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
            >
              <span>Campus Loop</span>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {user.university}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleNavClick('marketplace')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'marketplace'
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => handleNavClick('dorm-chef')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'dorm-chef'
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <span>Dorm Chef Pot</span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                Interactive
              </span>
            </button>
            <button
              onClick={() => handleNavClick('subscriptions')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'subscriptions'
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Subscriptions & Refills
            </button>
            <button
              onClick={() => handleNavClick('community')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1 ${
                activeTab === 'community'
                  ? 'border-stone-900 text-stone-900 font-semibold'
                  : 'border-transparent'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>Community Trust</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & User Affordances */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSellModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>List Item for Sale</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-stone-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Profile Button */}
            <button
              onClick={onOpenAccountModal}
              className="flex items-center gap-2 p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-700"
              aria-label="User account"
            >
              <div className="w-7 h-7 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-800 overflow-hidden">
                {user.name.charAt(0)}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-stone-800 truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg"
              aria-label="Open mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-4 space-y-2">
          <button
            onClick={() => handleNavClick('marketplace')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'marketplace' ? 'bg-amber-50 text-amber-900' : 'text-stone-700'
            }`}
          >
            Marketplace (Textbooks, Furniture & Kitchen)
          </button>
          <button
            onClick={() => handleNavClick('dorm-chef')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
              activeTab === 'dorm-chef' ? 'bg-amber-50 text-amber-900' : 'text-stone-700'
            }`}
          >
            <span>Dorm Chef Pot & Recipe Engine</span>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
              Interactive
            </span>
          </button>
          <button
            onClick={() => handleNavClick('subscriptions')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'subscriptions' ? 'bg-amber-50 text-amber-900' : 'text-stone-700'
            }`}
          >
            Subscriptions & Refills
          </button>
          <button
            onClick={() => handleNavClick('community')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'community' ? 'bg-amber-50 text-amber-900' : 'text-stone-700'
            }`}
          >
            Community Trust & Ratings
          </button>
        </div>
      )}
    </header>
  );
};
