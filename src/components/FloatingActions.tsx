import React from 'react';
import { CheckCircle2, MessageCircle, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppBookingUrl } from '../utils/bookingLogic';

export const FloatingActions: React.FC = () => {
  const { pathname, navigate } = useRouter();
  const { cart, cartSummary, setCartDrawerOpen, toast, dismissToast, settings } = useStore();
  const shouldReduceMotion = useReducedMotion();

  const whatsappHref =
    cart.length > 0
      ? buildWhatsAppBookingUrl(settings.whatsappNumber, { items: cart })
      : `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
          'Hello KAAM FIX, I would like to inquire about home services.'
        )}`;

  const hideCartShortcut = pathname === '/cart' || pathname === '/book' || pathname === '/admin';

  return (
    <>
      {/* Animated Confirmation Toast when adding services */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            role="status"
            aria-live="polite"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.14 } }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 z-40 sm:max-w-sm bg-gradient-to-br from-[#071426] via-[#0B1E38] to-[#0F4C5C] text-white rounded-xl shadow-2xl border border-white/15 p-4 flex items-start gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-[#4ADE80] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{toast.message}</p>
              {toast.subtext && <p className="text-xs text-white/75 mt-0.5">{toast.subtext}</p>}
              <div className="mt-2.5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    dismissToast();
                    navigate('/cart');
                  }}
                  className="text-xs font-semibold text-[#38BDF8] hover:underline cursor-pointer"
                >
                  View Cart ({cartSummary.totalUnits})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissToast();
                    navigate('/book');
                  }}
                  className="text-xs font-semibold text-[#FBBF24] hover:underline cursor-pointer"
                >
                  Proceed to Booking
                </button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={dismissToast}
              className="text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Bottom-Right Action Stack */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2.5">
        <AnimatePresence>
          {!hideCartShortcut && cartSummary.totalUnits > 0 && (
            <motion.button
              type="button"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`View cart with ${cartSummary.totalUnits} services`}
              className="btn-animated btn-grad-dark inline-flex items-center gap-2 h-11 px-4 rounded-full text-xs sm:text-sm font-semibold shadow-lg border border-white/20 cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
              <span className="font-mono-num">
                Cart ({cartSummary.totalUnits})
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with KAAM FIX on WhatsApp"
          className="btn-animated btn-grad-emerald inline-flex items-center gap-2 h-11 px-4 rounded-full text-xs sm:text-sm font-semibold shadow-lg whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </div>
    </>
  );
};
