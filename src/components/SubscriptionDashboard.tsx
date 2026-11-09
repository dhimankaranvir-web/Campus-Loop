import React, { useState } from 'react';
import { Calendar, RefreshCw, Pause, Play, FastForward, Check, MapPin, Plus, PackageCheck, AlertCircle } from 'lucide-react';
import { Subscription } from '../types.ts';

interface SubscriptionDashboardProps {
  subscriptions: Subscription[];
  onToggleStatus: (id: string) => void;
  onSkipNext: (id: string) => void;
  onChangeFrequency: (id: string, freq: 'Weekly' | 'Bi-Weekly' | 'Monthly') => void;
  onAddNewSubscription: (sub: Subscription) => void;
}

export const SubscriptionDashboard: React.FC<SubscriptionDashboardProps> = ({
  subscriptions,
  onToggleStatus,
  onSkipNext,
  onChangeFrequency,
  onAddNewSubscription,
}) => {
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [showItemCustomizer, setShowItemCustomizer] = useState(false);
  const [customItems, setCustomItems] = useState<string[]>([]);

  const handleOpenCustomizer = (sub: Subscription) => {
    setSelectedSub(sub);
    setCustomItems([...sub.includedItems]);
    setShowItemCustomizer(true);
  };

  const handleRemoveCustomItem = (idx: number) => {
    setCustomItems(customItems.filter((_, i) => i !== idx));
  };

  const [newItemInput, setNewItemInput] = useState('');
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemInput.trim()) return;
    setCustomItems([...customItems, newItemInput.trim()]);
    setNewItemInput('');
  };

  const handleSubscribePreset = (title: string, price: number, freq: 'Weekly' | 'Bi-Weekly' | 'Monthly', items: string[]) => {
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      title,
      tag: 'New Member',
      description: 'Scheduled recurring student dorm bundle delivery.',
      frequency: freq,
      price,
      nextDeliveryDate: 'In 3 days',
      status: 'Active',
      includedItems: items,
      deliveryLocation: 'MLK Student Union Locker #14',
      billingMethod: 'Campus Flex •••• 8842',
      category: 'Student Refills',
    };
    onAddNewSubscription(newSub);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider">
              <RefreshCw className="w-4 h-4" />
              <span>Repeat Customer Subscription Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Dorm Refill & Essentials Subscriptions
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Automate weekly fresh groceries, late-night study snack packs, and toilet paper refills straight to your dorm locker. Pause, skip, or swap items anytime with zero cancellation penalties.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Campus Flex Card Compatible</span>
            </span>
          </div>
        </div>
      </div>

      {/* Active Subscriptions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-amber-800" />
          <span>Your Active Subscriptions ({subscriptions.length})</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => {
            const isActive = sub.status === 'Active';
            const isPaused = sub.status === 'Paused';

            return (
              <div
                key={sub.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isActive
                    ? 'border-stone-200 shadow-sm'
                    : 'border-stone-200 opacity-80 bg-stone-50/70'
                }`}
              >
                <div>
                  {/* Status header */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : isPaused
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {sub.frequency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-2">{sub.title}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {sub.description}
                  </p>

                  {/* Delivery Location & Schedule */}
                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Calendar className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                      <span>Next Drop-off: <strong>{sub.nextDeliveryDate}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{sub.deliveryLocation}</span>
                    </div>
                  </div>

                  {/* Included Items preview */}
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-stone-600">Package Contents:</span>
                      <button
                        onClick={() => handleOpenCustomizer(sub)}
                        className="text-[11px] font-semibold text-amber-800 hover:text-amber-900"
                      >
                        Swap / Edit Items
                      </button>
                    </div>
                    <ul className="space-y-1 text-xs text-stone-600">
                      {sub.includedItems.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Pricing & Control Bar */}
                <div className="mt-6 pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-stone-400 block">Subscription Price</span>
                      <span className="text-xl font-extrabold text-stone-900 font-mono tabular-nums">
                        ${sub.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-stone-500"> / {sub.frequency.toLowerCase()}</span>
                    </div>

                    {/* Change Frequency */}
                    <div className="flex items-center gap-1">
                      {(['Weekly', 'Bi-Weekly', 'Monthly'] as const).map((freq) => (
                        <button
                          key={freq}
                          onClick={() => onChangeFrequency(sub.id, freq)}
                          className={`text-[10px] px-2 py-1 rounded transition-colors ${
                            sub.frequency === freq
                              ? 'bg-stone-900 text-white font-bold'
                              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                          }`}
                        >
                          {freq === 'Bi-Weekly' ? '2-Wk' : freq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Pause / Skip */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleStatus(sub.id)}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onSkipNext(sub.id)}
                      className="flex-1 py-2 px-3 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Skip Next Week</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discover More Student Subscriptions Section */}
      <div className="pt-6 border-t border-stone-200 space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Explore Student Refill Boxes
        </h2>
        <p className="text-xs text-stone-500">
          Zero lock-in contracts. Cancel or skip right before midterms or winter break.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-amber-800">Caffeine & Exam Fuel</span>
              <h3 className="text-base font-bold text-stone-900">
                Cold Brew & Energy Snacks Box ($14.00 / bi-weekly)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                4 canned artisanal cold brews, dark chocolate almond clusters, and roasted chickpeas.
              </p>
            </div>
            <button
              onClick={() =>
                handleSubscribePreset(
                  'Cold Brew & Energy Snacks Box',
                  14.0,
                  'Bi-Weekly',
                  ['Cold Brew Cans (4ct)', 'Almond Clusters', 'Energy Bars']
                )
              }
              className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              + Subscribe with 1-Click
            </button>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold text-amber-800">Dorm Cleanliness</span>
              <h3 className="text-base font-bold text-stone-900">
                Eco Detergent Sheets & Dish Soap Pods ($8.50 / month)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Never haul heavy liquid detergent jugs across the campus laundry room again.
              </p>
            </div>
            <button
              onClick={() =>
                handleSubscribePreset(
                  'Eco Detergent & Dish Pods',
                  8.5,
                  'Monthly',
                  ['Detergent Sheets (32ct)', 'Dish Soap Pods (20ct)', 'Sponges (2ct)']
                )
              }
              className="px-4 py-2 bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
            >
              + Subscribe with 1-Click
            </button>
          </div>
        </div>
      </div>

      {/* Item Customizer Modal */}
      {showItemCustomizer && selectedSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Customize: {selectedSub.title}
            </h3>
            <p className="text-xs text-stone-500">
              Add or remove items for your upcoming delivery package.
            </p>

            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {customItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 bg-stone-50 rounded-lg text-xs font-medium text-stone-800"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => handleRemoveCustomItem(idx)}
                    className="text-stone-400 hover:text-red-600 text-xs px-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddCustomItem} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Extra Bananas or Sriracha"
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg"
              >
                + Add
              </button>
            </form>

            <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => setShowItemCustomizer(false)}
                className="px-4 py-2 bg-amber-800 text-white text-xs font-semibold rounded-lg"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
