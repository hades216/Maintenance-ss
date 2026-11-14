import React from 'react';
import { ArrowRight, MessageCircle, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppBookingUrl, formatServicePrice } from '../utils/bookingLogic';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const { navigate } = useRouter();
  const {
    cart,
    cartSummary,
    isCartDrawerOpen,
    setCartDrawerOpen,
    setQuantity,
    removeFromCart,
    clearCart,
    settings,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const whatsappUrl = buildWhatsAppBookingUrl(settings.whatsappNumber, { items: cart });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#071426]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Service Shopping Cart"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0B1E38]">
              Your Service Cart
            </h2>
            <p className="text-xs text-[#5A6475]">
              {cartSummary.totalUnits} {cartSummary.totalUnits === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            type="button"
            aria-label="Close cart drawer"
            onClick={() => setCartDrawerOpen(false)}
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg bg-[#F4F5F7] text-[#0B1E38] hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#5A6475] mb-4">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-semibold text-[#0B1E38]">
                Your service cart is empty
              </h3>
              <p className="mt-2 text-sm text-[#5A6475]">
                Pick the electrical, plumbing, carpentry, painting, or repair jobs you need and
                book them all together.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/services');
                }}
                className="btn-animated btn-grad-primary mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
              >
                Browse Services
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.serviceId}
                className="flex gap-3.5 pb-4 border-b border-slate-100 last:border-b-0"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F4F5F7]">
                  <SafeImage
                    imageKey={item.imageKey}
                    customUrl={item.customImageUrl}
                    alt={item.serviceName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#5A6475]">{item.categoryName}</p>
                  <h3 className="font-display text-sm font-semibold text-[#0B1E38] truncate">
                    {item.serviceName}
                  </h3>
                  <p className="text-xs font-medium text-[#1D6FF2] mt-0.5 font-mono-num">
                    {formatServicePrice(item.pricingType, item.pricePkr, 'short')}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center border border-slate-200 rounded-lg bg-[#F4F5F7]">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.serviceName}`}
                        onClick={() => setQuantity(item.serviceId, item.quantity - 1)}
                        className="w-8 h-8 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-l-lg cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold font-mono-num text-[#0B1E38]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.serviceName}`}
                        onClick={() => setQuantity(item.serviceId, item.quantity + 1)}
                        className="w-8 h-8 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-r-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${item.serviceName} from cart`}
                      onClick={() => removeFromCart(item.serviceId)}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 py-1 px-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-[#F4F5F7] space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#5A6475]">Price Summary</p>
                <p className="font-display text-base font-bold text-[#0B1E38] font-mono-num">
                  {cartSummary.summaryLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-medium text-[#5A6475] hover:text-red-600 underline underline-offset-2 cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
            <p className="text-xs text-[#5A6475] leading-relaxed">{cartSummary.explanation}</p>

            <div className="grid grid-cols-1 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/book');
                }}
                className="group btn-animated btn-grad-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold cursor-pointer"
              >
                <span>Proceed to Booking</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="btn-animated inline-flex items-center justify-center px-3 py-2.5 rounded-lg bg-white border border-slate-200 text-[#0B1E38] text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  View Full Cart
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated btn-grad-emerald inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
