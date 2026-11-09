import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, School, MapPin, Key, Award, CheckCircle2 } from 'lucide-react';
import { UserAccount, Product } from '../types.ts';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpdateUser: (user: UserAccount) => void;
  userListings: Product[];
  onOpenSellModal: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  userListings,
  onOpenSellModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'listings'>('profile');
  const [name, setName] = useState(user.name);
  const [dormBuilding, setDormBuilding] = useState(user.dormBuilding);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      dormBuilding,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const toggle2FA = () => {
    onUpdateUser({
      ...user,
      twoFactorEnabled: !user.twoFactorEnabled,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-800 text-white font-bold flex items-center justify-center text-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                <span>{user.name}</span>
                {user.isEduVerified && (
                  <span className="flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />
                    .edu Verified
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 font-mono">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 border-b-2 transition-colors mr-5 ${
              activeTab === 'profile'
                ? 'border-amber-800 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Student Profile
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 border-b-2 transition-colors mr-5 flex items-center gap-1 ${
              activeTab === 'security'
                ? 'border-amber-800 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-800" />
            <span>Data Security & Escrow</span>
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'listings'
                ? 'border-amber-800 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            My Active Listings ({userListings.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    University Affiliation
                  </label>
                  <input
                    type="text"
                    value={user.university}
                    disabled
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-100 text-stone-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Student ID Last 4
                  </label>
                  <input
                    type="text"
                    value={`•••• ${user.studentIdLast4}`}
                    disabled
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-100 text-stone-600 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Residence Hall / Locker Drop Address
                </label>
                <input
                  type="text"
                  value={dormBuilding}
                  onChange={(e) => setDormBuilding(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  required
                />
              </div>

              {/* Karma & Trust Points Banner */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-800" />
                  <div>
                    <span className="font-bold text-amber-950">Campus Karma Score</span>
                    <p className="text-[11px] text-stone-600">
                      Earned through on-time locker drops and verified student handoffs.
                    </p>
                  </div>
                </div>
                <span className="font-mono text-base font-extrabold text-amber-900">
                  {user.karmaPoints} pts
                </span>
              </div>

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900">2-Factor Authentication (2FA)</span>
                      <p className="text-[11px] text-stone-500">
                        Requires SMS / Authenticator app PIN before authorizing funds release.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggle2FA}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      user.twoFactorEnabled
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {user.twoFactorEnabled ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900">Campus Escrow Safety Rating</span>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-600">Community Trust Level</span>
                  <span className="font-mono font-bold text-emerald-700">{user.safetyScore}% (Exceptional)</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 mt-1">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${user.safetyScore}%` }} />
                </div>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span className="font-bold text-stone-900">Encrypted Local Data Protection</span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Your payment tokens and student verification credentials are authenticated locally and never sold to third-party ad networks. Locker codes are dynamically randomized for each transaction.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Items you have currently active on the campus feed:
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSellModal();
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-amber-800 text-white rounded-md"
                >
                  + Add Listing
                </button>
              </div>

              {userListings.length === 0 ? (
                <div className="text-center py-8 text-xs text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <p>You haven't listed any items for sale yet.</p>
                  <p className="mt-1">Got old textbooks or dorm gear? Earn cash from peers.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {userListings.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-bold text-stone-900 truncate">{item.title}</p>
                          <p className="text-[11px] text-stone-500 font-mono">
                            ${item.price.toFixed(2)} · {item.condition} · {item.category}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                        Live on Feed
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
