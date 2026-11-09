/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { AdvancedFilters } from './components/AdvancedFilters.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { DormChefBuilder } from './components/DormChefBuilder.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { SubscriptionDashboard } from './components/SubscriptionDashboard.tsx';
import { ListProductModal } from './components/ListProductModal.tsx';
import { NotificationCenter } from './components/NotificationCenter.tsx';
import { AccountModal } from './components/AccountModal.tsx';
import { CommunityTrustSection } from './components/CommunityTrustSection.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import {
  INITIAL_PRODUCTS,
  INITIAL_USER,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData.ts';
import {
  Product,
  ProductCategory,
  ProductCondition,
  CartItem,
  UserAccount,
  Subscription,
  NotificationItem,
  Review,
} from './types.ts';
import { BookOpen, Armchair, CookingPot, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'marketplace' | 'dorm-chef' | 'subscriptions' | 'community'>('marketplace');

  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [user, setUser] = useState<UserAccount>(INITIAL_USER);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Filters State
  const [filters, setFilters] = useState({
    searchQuery: '',
    category: 'all' as ProductCategory | 'all',
    subcategory: '',
    maxPrice: 100,
    condition: 'all' as ProductCondition | 'all',
    sortBy: 'price-low' as 'price-low' | 'price-high' | 'rating' | 'newest',
    onlyVerifiedSellers: false,
    onlyUnder25: false,
  });

  // Modals
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'deal', title: string, description: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Periodic sample push notification for personalized dorm deals
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pushEnabled) {
        addToast(
          'deal',
          '🔥 Flash Deal in Unit 1',
          'A sophomore just listed a Microwave & Study Lamp bundle for $22!'
        );
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, [pushEnabled]);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: `cart_${product.id}_${Date.now()}`,
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
          condition: product.condition,
          sellerName: product.seller.name,
        },
      ];
    });

    addToast('success', 'Added to Cart', `${product.title} added to your shopping bag.`);
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    setIsCheckoutOpen(true);
  };

  const handleAddCustomBundleToCart = (
    items: { id: string; title: string; price: number; quantity: number }[]
  ) => {
    const newCartItems: CartItem[] = items.map((item) => ({
      id: item.id,
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: '',
      category: 'ingredients',
    }));

    setCart((prev) => [...prev, ...newCartItems]);
    addToast(
      'success',
      'Meal Kit Added to Cart',
      `${items.length} dorm ingredients added to shopping bag!`
    );
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Listings & Reviews
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    addToast(
      'success',
      'Listing Published',
      `"${newProduct.title}" is now visible to students across ${user.university}.`
    );

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'deal',
      title: 'Listing Active',
      body: `Your item "${newProduct.title}" ($${newProduct.price}) was published with escrow protection.`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddReview = (
    productId: string,
    newReview: Omit<Review, 'id' | 'productId'>
  ) => {
    const reviewWithId: Review = {
      ...newReview,
      id: `rev_${Date.now()}`,
      productId,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentReviews = p.reviews || [];
          return {
            ...p,
            reviews: [reviewWithId, ...currentReviews],
          };
        }
        return p;
      })
    );

    if (selectedProductDetail && selectedProductDetail.id === productId) {
      setSelectedProductDetail((prev) =>
        prev
          ? {
              ...prev,
              reviews: [reviewWithId, ...(prev.reviews || [])],
            }
          : null
      );
    }

    addToast('success', 'Review Submitted', 'Thank you for building campus community trust!');
  };

  // Subscriptions management
  const handleToggleSubscriptionStatus = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const newStatus = s.status === 'Active' ? 'Paused' : 'Active';
          addToast(
            'info',
            'Subscription Updated',
            `"${s.title}" has been ${newStatus.toLowerCase()}.`
          );
          return { ...s, status: newStatus };
        }
        return s;
      })
    );
  };

  const handleSkipNext = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          addToast(
            'info',
            'Delivery Skipped',
            `Next delivery skipped for "${s.title}". You will not be billed this week.`
          );
          return { ...s, nextDeliveryDate: 'Skipped to next cycle' };
        }
        return s;
      })
    );
  };

  const handleChangeFrequency = (
    id: string,
    freq: 'Weekly' | 'Bi-Weekly' | 'Monthly'
  ) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          addToast(
            'info',
            'Frequency Adjusted',
            `"${s.title}" frequency changed to ${freq}.`
          );
          return { ...s, frequency: freq };
        }
        return s;
      })
    );
  };

  const handleAddNewSubscription = (sub: Subscription) => {
    setSubscriptions((prev) => [sub, ...prev]);
    addToast(
      'success',
      'Subscribed!',
      `You are now enrolled in "${sub.title}". First drop arrives in 3 days.`
    );
  };

  // Order success handler
  const handleOrderSuccess = (orderSummary: {
    orderId: string;
    totalAmount: number;
    pickupLocation: string;
    lockerCode: string;
    paymentMethod: string;
  }) => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'order',
      title: `📦 Order ${orderSummary.orderId} Confirmed`,
      body: `Total: $${orderSummary.totalAmount.toFixed(2)}. Pick up at ${orderSummary.pickupLocation}. Locker PIN: ${orderSummary.lockerCode}.`,
      timestamp: 'Just now',
      read: false,
    };

    setNotifications((prev) => [notif, ...prev]);
    addToast(
      'success',
      'Order Confirmed & PIN Dispatched',
      `Locker code ${orderSummary.lockerCode} sent to your notification center!`
    );
  };

  // Push notifications toggle
  const handleTogglePush = () => {
    const nextState = !pushEnabled;
    setPushEnabled(nextState);
    if (nextState) {
      addToast(
        'info',
        'Push Notifications Enabled',
        'You will receive live locker unlock codes and campus deal updates.'
      );
    } else {
      addToast('info', 'Push Alerts Paused', 'Web push notifications are now muted.');
    }
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications Cleared', 'All alerts marked as read.');
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      subcategory: '',
      maxPrice: 100,
      condition: 'all',
      sortBy: 'price-low',
      onlyVerifiedSellers: false,
      onlyUnder25: false,
    });
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesSub = p.subcategory.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesIsbn = p.isbn ? p.isbn.toLowerCase().includes(q) : false;
          const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesSub && !matchesDesc && !matchesIsbn && !matchesTags) {
            return false;
          }
        }

        // Category
        if (filters.category !== 'all' && p.category !== filters.category) {
          return false;
        }

        // Max price
        if (p.price > filters.maxPrice) {
          return false;
        }

        // Condition
        if (filters.condition !== 'all' && p.condition !== filters.condition) {
          return false;
        }

        // Verified sellers
        if (filters.onlyVerifiedSellers && !p.seller.isEduVerified) {
          return false;
        }

        // Under 25
        if (filters.onlyUnder25 && p.price > 25) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-low') return a.price - b.price;
        if (filters.sortBy === 'price-high') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.seller.rating - a.seller.rating;
        return 0;
      });
  }, [products, filters]);

  // User's own listings
  const userListings = useMemo(() => {
    return products.filter((p) => p.seller.id === user.id);
  }, [products, user.id]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCheckoutOpen(true)}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotifCount}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <div>
            {/* Hero Banner with value prop & proof */}
            <HeroBanner
              onSelectCategory={(cat) => setFilters({ ...filters, category: cat })}
              onOpenDormChef={() => setActiveTab('dorm-chef')}
              onOpenSellModal={() => setIsSellModalOpen(true)}
              selectedCategory={filters.category}
            />

            {/* Advanced Filters & Search */}
            <AdvancedFilters
              filters={filters}
              onChangeFilters={setFilters}
              onResetFilters={handleResetFilters}
              totalResultsCount={filteredProducts.length}
            />

            {/* Products Feed Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 capitalize">
                    {filters.category === 'all'
                      ? 'Featured Campus Listings'
                      : `${filters.category} Deals`}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Showing available items verified at {user.university} and surrounding dorms
                  </p>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3 max-w-md mx-auto">
                  <p className="text-sm font-semibold text-stone-800">
                    No student items match your current filter criteria.
                  </p>
                  <p className="text-xs text-stone-500">
                    Try adjusting the price slider or clearing your search keywords.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onOpenDetails={setSelectedProductDetail}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'dorm-chef' && (
          <DormChefBuilder
            onAddCustomBundleToCart={handleAddCustomBundleToCart}
            products={products}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionDashboard
            subscriptions={subscriptions}
            onToggleStatus={handleToggleSubscriptionStatus}
            onSkipNext={handleSkipNext}
            onChangeFrequency={handleChangeFrequency}
            onAddNewSubscription={handleAddNewSubscription}
          />
        )}

        {activeTab === 'community' && (
          <CommunityTrustSection
            products={products}
            onSelectProduct={setSelectedProductDetail}
            onOpenSellModal={() => setIsSellModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-stone-500 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-stone-900">Campus Loop</p>
              <p className="mt-0.5">
                The trusted student marketplace for textbooks, furniture, cookware, and dorm meals.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-stone-600 font-medium">
              <button onClick={() => setActiveTab('marketplace')} className="hover:text-stone-900">
                Marketplace
              </button>
              <button onClick={() => setActiveTab('dorm-chef')} className="hover:text-stone-900">
                Dorm Chef Pot
              </button>
              <button onClick={() => setActiveTab('subscriptions')} className="hover:text-stone-900">
                Refill Subscriptions
              </button>
              <button onClick={() => setActiveTab('community')} className="hover:text-stone-900">
                Escrow Guarantee
              </button>
              <button onClick={() => setIsSellModalOpen(true)} className="text-amber-800 font-semibold hover:text-amber-900">
                Sell an Item
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
            <p>© 2026 Campus Loop. Verified for University Students. Zero listing markups.</p>
            <p>256-bit encrypted checkout · Safe campus locker hand-offs · .edu authentication</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onAddReview={handleAddReview}
        currentUserUniversity={user.university}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />

      <ListProductModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onAddProduct={handleAddProduct}
        user={user}
      />

      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onDismissNotification={handleDismissNotification}
        pushEnabled={pushEnabled}
        onTogglePush={handleTogglePush}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        user={user}
        onUpdateUser={setUser}
        userListings={userListings}
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      {/* Live Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
