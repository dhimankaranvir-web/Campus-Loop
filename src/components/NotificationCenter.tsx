import React, { useState } from 'react';
import { Bell, X, Check, Package, Sparkles, MessageCircle, ShieldAlert, Volume2 } from 'lucide-react';
import { NotificationItem } from '../types.ts';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onDismissNotification: (id: string) => void;
  pushEnabled: boolean;
  onTogglePush: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onDismissNotification,
  pushEnabled,
  onTogglePush,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'deals'>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'orders') return notif.type === 'order';
    if (activeTab === 'deals') return notif.type === 'deal';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-800" />
            <h2 className="text-sm font-bold text-stone-900">Push & Order Updates</h2>
            {unreadCount > 0 && (
              <span className="text-[11px] bg-amber-800 text-white font-mono px-1.5 py-0.2 rounded-full font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-stone-500 hover:text-stone-900 font-medium"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700"
              aria-label="Close notification center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Push Notification Opt-In Banner */}
        <div className="p-3.5 bg-amber-50/80 border-b border-amber-200/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2">
            <Volume2 className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                {pushEnabled ? 'Web Push Notifications Enabled' : 'Enable Live Push Alerts'}
              </p>
              <p className="text-stone-600 text-[11px]">
                {pushEnabled
                  ? 'Receiving locker drop-off PINs & dorm flash deals in real-time.'
                  : 'Get instant locker PIN codes & drop alerts when sellers deliver.'}
              </p>
            </div>
          </div>

          <button
            onClick={onTogglePush}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              pushEnabled
                ? 'bg-amber-800 text-white hover:bg-amber-900'
                : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
            }`}
          >
            {pushEnabled ? 'Enabled ✓' : 'Turn On'}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-100 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2.5 py-1 rounded font-medium ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-2.5 py-1 rounded font-medium ${
              activeTab === 'orders'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Orders & Lockers
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-2.5 py-1 rounded font-medium ${
              activeTab === 'deals'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Dorm Deals
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 transition-colors flex items-start gap-3 ${
                  !notif.read ? 'bg-amber-50/40' : 'hover:bg-stone-50'
                }`}
              >
                {/* Icon based on type */}
                <div className="mt-0.5 shrink-0">
                  {notif.type === 'order' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'deal' && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'message' && (
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  )}
                  {notif.type === 'system' && (
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-stone-900 truncate">
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    {notif.body}
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => onDismissNotification(notif.id)}
                  className="text-stone-300 hover:text-stone-600 p-0.5 shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 text-center text-[11px] text-stone-500">
          Campus Loop uses Web Push API standards to notify you of locker access codes and student messages.
        </div>
      </div>
    </div>
  );
};
