import React from 'react';
import {
  ArrowRight,
  Info,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { Link, useDocumentMeta, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppBookingUrl, formatServicePrice } from '../utils/bookingLogic';

export const CartPage: React.FC = () => {
  useDocumentMeta(
    'Service Cart | KAAM FIX Rawalpindi',
    'Review your selected home maintenance and construction services, adjust quantities, and proceed to booking or WhatsApp.'
  );

  const { navigate } = useRouter();
  const {
    cart,
    cartSummary,
    setQuantity,
    setItemNotes,
    removeFromCart,
    clearCart,
    settings,
  } = useStore();

  const whatsappUrl = buildWhatsAppBookingUrl(settings.whatsappNumber, { items: cart });

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-gradient-to-b from-sky-50/40 via-[#F4F5F7] to-amber-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
              Your Selected Jobs
            </p>
            <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight">
              Your Service Cart
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#5A6475]">
              Add electrical, plumbing, carpentry, painting, and repair jobs together and send one
              booking.
            </p>
          </div>
          <Link
            to="/services"
            className="text-sm font-semibold text-[#1D6FF2] hover:underline whitespace-nowrap"
          >
            + Add More Services
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#0B1E38] mb-5">
              <ShoppingCart className="w-7 h-7" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0B1E38]">
              Your KAAM FIX cart is empty
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5A6475] leading-relaxed">
              Browse our service categories to select everything you need fixed or upgraded in your
              home. Your selections stay saved here while you browse.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <Link
                to="/contact"
                className="btn-animated inline-flex items-center px-6 py-3 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-[#0B1E38] text-sm font-semibold whitespace-nowrap"
              >
                Contact KAAM FIX
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.serviceId}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-full sm:w-32 h-36 sm:h-28 rounded-lg overflow-hidden bg-[#F4F5F7] shrink-0">
                    <SafeImage
                      imageKey={item.imageKey}
                      customUrl={item.customImageUrl}
                      alt={item.serviceName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium text-[#5A6475]">
                          {item.categoryName} · {item.unitLabel}
                        </p>
                        <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                          {item.serviceName}
                        </h2>
                      </div>
                      <p className="font-mono-num text-sm font-semibold text-[#1D6FF2] shrink-0">
                        {formatServicePrice(item.pricingType, item.pricePkr, 'short')}
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor={`notes-${item.serviceId}`}
                        className="block text-xs font-medium text-[#5A6475] mb-1"
                      >
                        Notes for the technician (optional)
                      </label>
                      <input
                        id={`notes-${item.serviceId}`}
                        type="text"
                        value={item.notes}
                        onChange={(e) => setItemNotes(item.serviceId, e.target.value)}
                        placeholder="e.g., kitchen tap, 2nd floor bedroom, or extra details..."
                        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-[#F4F5F7] focus:bg-white text-xs sm:text-sm text-[#1E2430] focus:outline-2 focus:outline-[#1D6FF2]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[#5A6475]">Qty:</span>
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-[#F4F5F7]">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.serviceName}`}
                            onClick={() => setQuantity(item.serviceId, item.quantity - 1)}
                            className="w-9 h-9 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span
                            data-testid={`cart-qty-${item.serviceId}`}
                            className="px-3 text-sm font-semibold font-mono-num text-[#0B1E38]"
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.serviceName}`}
                            onClick={() => setQuantity(item.serviceId, item.quantity + 1)}
                            className="w-9 h-9 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.serviceId)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 py-1.5 px-2.5 rounded-lg hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between pt-2">
                <Link
                  to="/services"
                  className="text-sm font-semibold text-[#0B1E38] hover:text-[#1D6FF2]"
                >
                  ← Continue Browsing Services
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-medium text-red-600 hover:underline cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <aside className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-6 sticky top-24 space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                Booking Summary
              </h2>

              <div className="space-y-2.5 text-sm pb-4 border-b border-slate-200">
                <div className="flex justify-between">
                  <span className="text-[#5A6475]">Jobs in Cart</span>
                  <span className="font-semibold font-mono-num text-[#0B1E38]">
                    {cartSummary.distinctServices}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5A6475]">Total Items</span>
                  <span className="font-semibold font-mono-num text-[#0B1E38]">
                    {cartSummary.totalUnits}
                  </span>
                </div>
                {cartSummary.fixedSubtotalPkr > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#5A6475]">Fixed-Rate Subtotal</span>
                    <span className="font-semibold font-mono-num text-[#0B1E38]">
                      PKR {cartSummary.fixedSubtotalPkr.toLocaleString('en-PK')}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5A6475]">
                  Price Summary
                </p>
                <p className="mt-1 font-display text-lg font-bold text-[#0B1E38] font-mono-num">
                  {cartSummary.summaryLabel}
                </p>
                <div className="mt-3 p-3.5 rounded-lg bg-[#F4F5F7] flex items-start gap-2.5 text-xs text-[#5A6475] leading-relaxed">
                  <Info className="w-4 h-4 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{cartSummary.explanation}</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/book')}
                  className="group btn-animated btn-grad-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  <span>Proceed to Booking</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated btn-grad-emerald w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Send Cart to WhatsApp</span>
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};
