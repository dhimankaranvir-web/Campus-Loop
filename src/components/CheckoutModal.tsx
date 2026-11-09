import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, CreditCard, Lock, CheckCircle2, MapPin, Tag, ArrowRight, Smartphone, School } from 'lucide-react';
import { CartItem, UserAccount } from '../types.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  user: UserAccount;
  onOrderSuccess: (orderSummary: {
    orderId: string;
    totalAmount: number;
    pickupLocation: string;
    lockerCode: string;
    paymentMethod: string;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  user,
  onOrderSuccess,
}) => {
  const [step, setStep] = useState<'cart' | 'shipping_payment' | 'confirmed'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<'locker' | 'hand-off' | 'dorm-door'>('locker');
  const [selectedLocker, setSelectedLocker] = useState('MLK Student Union 24/7 Locker Bank #B');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'flex' | 'apple-pay' | 'klarna'>('card');

  // Payment form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('739');
  const [cardholderName, setCardholderName] = useState(user.name);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Confirmed details
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    lockerCode: string;
    total: number;
    location: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const studentPlatformFee = 0.99; // Minimal campus security escrow fee
  const discountAmount = appliedDiscount ? appliedDiscount.amount : 0;
  const total = Math.max(0, subtotal + studentPlatformFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'STUDENT15') {
      const discount = subtotal * 0.15;
      setAppliedDiscount({ code: 'STUDENT15 (15% Off)', amount: discount });
      setPromoCode('');
    } else if (code === 'FRESHER10') {
      setAppliedDiscount({ code: 'FRESHER10 ($10 Off)', amount: 10 });
      setPromoCode('');
    } else if (code === 'BROKECOLLEGE') {
      setAppliedDiscount({ code: 'BROKECOLLEGE ($5 Off)', amount: 5 });
      setPromoCode('');
    } else {
      setPromoError('Invalid campus code. Try "STUDENT15" or "BROKECOLLEGE"');
    }
  };

  const handleProcessOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `UN-${Math.floor(100000 + Math.random() * 900000)}`;
      const lockerCode = `${Math.floor(1000 + Math.random() * 9000)}-#${Math.floor(10 + Math.random() * 89)}`;

      const locationLabel =
        deliveryMethod === 'locker'
          ? selectedLocker
          : deliveryMethod === 'dorm-door'
          ? user.dormBuilding
          : 'Direct Campus Meeting Spot (Library)';

      setConfirmedOrder({
        orderId,
        lockerCode,
        total,
        location: locationLabel,
      });

      setIsProcessing(false);
      setStep('confirmed');

      onOrderSuccess({
        orderId,
        totalAmount: total,
        pickupLocation: locationLabel,
        lockerCode,
        paymentMethod:
          paymentMethod === 'flex'
            ? 'Campus Flex Card'
            : paymentMethod === 'apple-pay'
            ? 'Apple Pay'
            : 'Visa •••• 4242',
      });

      onClearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">
              {step === 'cart' && 'Your Campus Cart'}
              {step === 'shipping_payment' && 'Secure Campus Checkout'}
              {step === 'confirmed' && 'Order Confirmed!'}
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              {cart.length} item{cart.length !== 1 ? 's' : ''}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {step === 'cart' && (
            <div className="space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-stone-500 text-sm">Your campus shopping bag is empty.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
                  >
                    Browse Textbooks & Gear
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3 divide-y divide-stone-100">
                    {cart.map((item) => (
                      <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-14 h-14 object-cover rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-lg shrink-0">
                            📦
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-stone-900 truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-500 capitalize">
                            {item.category} {item.condition ? `· ${item.condition}` : ''}
                          </p>
                          <div className="mt-1 font-mono text-xs font-bold text-stone-900">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg p-1 bg-stone-50">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-white rounded transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-mono font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-white rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code Input */}
                  <form onSubmit={handleApplyPromo} className="pt-4 border-t border-stone-200">
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      Student Promo / Campus Discount Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. STUDENT15 or BROKECOLLEGE"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg uppercase font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-red-600 mt-1">{promoError}</p>
                    )}
                    {appliedDiscount && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                        ✓ Applied: {appliedDiscount.code} (-${appliedDiscount.amount.toFixed(2)})
                      </p>
                    )}
                  </form>

                  {/* Pricing Summary */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-600">
                      <span>Items Subtotal</span>
                      <span className="font-mono text-stone-900">${subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Student Promo Discount</span>
                        <span className="font-mono">-${appliedDiscount.amount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-stone-600">
                      <span>Peer Escrow & Campus Safety Fee</span>
                      <span className="font-mono text-stone-900">${studentPlatformFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                      <span>Total</span>
                      <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('shipping_payment')}
                    className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Proceed to Delivery & Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {step === 'shipping_payment' && (
            <div className="space-y-6">
              {/* Delivery / Hand-off Method */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>1. Choose Safe Campus Pickup / Drop-off</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('locker')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'locker'
                        ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900">24/7 Smart Locker</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Contactless drop. Open with phone QR or 4-digit PIN.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('hand-off')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'hand-off'
                        ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900">Campus Meeting</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Meet seller in front of library or dining hall commons.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('dorm-door')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryMethod === 'dorm-door'
                        ? 'border-amber-800 bg-amber-50/60 ring-1 ring-amber-800'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold text-stone-900">Dorm Hallway</div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Deliver to: {user.dormBuilding.split('Rm')[0]}
                    </p>
                  </button>
                </div>

                {deliveryMethod === 'locker' && (
                  <select
                    value={selectedLocker}
                    onChange={(e) => setSelectedLocker(e.target.value)}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800"
                  >
                    <option value="MLK Student Union 24/7 Locker Bank #B">
                      MLK Student Union - 24/7 Locker Bank #B (Central)
                    </option>
                    <option value="North Quad Engineering Locker Station #1">
                      North Quad Engineering Locker Station #1 (North Gate)
                    </option>
                    <option value="Unit 1 & Unit 2 Residence Halls Shared Locker #A">
                      Unit 1 & Unit 2 Residence Halls Shared Locker #A
                    </option>
                  </select>
                )}
              </div>

              {/* Payment Gateway */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>2. Secure Payment Gateway (256-bit Encrypted)</span>
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Escrow Protected
                  </span>
                </div>

                {/* Payment Option Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-stone-900 bg-stone-900 text-white font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mx-auto mb-1" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('flex')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'flex'
                        ? 'border-amber-800 bg-amber-800 text-white font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <School className="w-4 h-4 mx-auto mb-1" />
                    <span>Campus Flex</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple-pay')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'apple-pay'
                        ? 'border-stone-900 bg-stone-900 text-white font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mx-auto mb-1" />
                    <span>Apple / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('klarna')}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      paymentMethod === 'klarna'
                        ? 'border-pink-600 bg-pink-600 text-white font-bold'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span className="font-extrabold block text-sm">4x</span>
                    <span>Split Pay ($0 fee)</span>
                  </button>
                </div>

                {/* Form fields based on payment method */}
                {paymentMethod === 'card' && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">CVC / CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'flex' && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-amber-950">
                        {user.university} Student Flex Account:
                      </span>
                      <span className="font-mono font-bold text-amber-900">
                        Balance: ${user.flexCardBalance.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-stone-600">
                      ID Number: <strong>•••• •••• {user.studentIdLast4}</strong> (Student Maya Chen)
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Amount of <strong>${total.toFixed(2)}</strong> will be deducted from your official campus account.
                    </p>
                  </div>
                )}

                {paymentMethod === 'apple-pay' && (
                  <div className="p-4 bg-stone-100 rounded-xl text-center text-xs text-stone-700">
                    <p className="font-medium">Touch ID or Face ID ready</p>
                    <p className="text-stone-500 text-[11px] mt-0.5">
                      Double-click side button to authorize payment with Apple Wallet.
                    </p>
                  </div>
                )}

                {paymentMethod === 'klarna' && (
                  <div className="p-4 bg-pink-50 rounded-xl border border-pink-200 text-xs text-stone-800 space-y-1">
                    <p className="font-bold text-pink-900">Student 4-Pay Installment Plan:</p>
                    <p>
                      Pay <strong>${(total / 4).toFixed(2)}</strong> today, then ${(total / 4).toFixed(2)} every 2 weeks. 0% interest for verified university students.
                    </p>
                  </div>
                )}
              </div>

              {/* Total & Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Back to Bag
                </button>

                <button
                  type="button"
                  onClick={handleProcessOrder}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-stone-900 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying Escrow & Authorizing...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize & Pay ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  Payment Authorized & Order Confirmed!
                </h3>
                <p className="text-xs text-stone-500 mt-1 font-mono">
                  Order ID: {confirmedOrder.orderId}
                </p>
              </div>

              {/* Locker Access Voucher */}
              <div className="p-4 bg-stone-50 border border-stone-300 rounded-xl max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-500">Campus Pickup Spot</span>
                  <span className="font-semibold text-stone-800 truncate max-w-[200px]">
                    {confirmedOrder.location}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-stone-200">
                  <span className="text-stone-500">24/7 Locker Pickup Code</span>
                  <span className="font-mono text-base font-extrabold text-amber-800">
                    {confirmedOrder.lockerCode}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-stone-200">
                  <span className="text-stone-500">Escrow Status</span>
                  <span className="text-emerald-700 font-bold">Funds in Escrow until inspected</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-lg text-xs text-amber-900 max-w-sm mx-auto">
                🔔 <strong>Push Notification Dispatched:</strong> Check your campus notification center for real-time locker unlock alert!
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Done Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
