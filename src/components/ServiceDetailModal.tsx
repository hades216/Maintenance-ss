import React, { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { formatServicePrice } from '../utils/bookingLogic';
import { SafeImage } from './SafeImage';

export const ServiceDetailModal: React.FC = () => {
  const { navigate } = useRouter();
  const {
    selectedServiceForModal,
    setSelectedServiceForModal,
    categories,
    addToCart,
  } = useStore();

  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setQty(1);
    setNotes('');
  }, [selectedServiceForModal]);

  if (!selectedServiceForModal) return null;

  const category = categories.find((c) => c.slug === selectedServiceForModal.categorySlug);

  const handleAdd = () => {
    addToCart(selectedServiceForModal, qty, notes);
    setSelectedServiceForModal(null);
  };

  const handleBookImmediately = () => {
    addToCart(selectedServiceForModal, qty, notes, true);
    setSelectedServiceForModal(null);
    navigate('/book');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={selectedServiceForModal.name}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        <div className="relative h-56 sm:h-64 bg-[#F4F5F7] shrink-0">
          <SafeImage
            imageKey={selectedServiceForModal.imageKey}
            customUrl={selectedServiceForModal.customImageUrl}
            alt={selectedServiceForModal.name}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            aria-label="Close service details"
            onClick={() => setSelectedServiceForModal(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 text-[#0B1E38] flex items-center justify-center shadow-md hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6475]">
              <span className="font-medium text-[#0B1E38]">
                {category?.name || 'Home Services'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num font-semibold text-[#1D6FF2]">
                {formatServicePrice(
                  selectedServiceForModal.pricingType,
                  selectedServiceForModal.pricePkr,
                  'short'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedServiceForModal.unitLabel}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#0B1E38] mt-1.5">
              {selectedServiceForModal.name}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-[#5A6475] leading-relaxed">
              {selectedServiceForModal.detailedDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                Quantity
              </label>
              <div className="inline-flex items-center border border-slate-200 rounded-lg bg-[#F4F5F7]">
                <button
                  type="button"
                  aria-label="Decrease service quantity"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-l-lg cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold font-mono-num text-[#0B1E38]">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase service quantity"
                  onClick={() => setQty((prev) => Math.min(99, prev + 1))}
                  className="w-10 h-10 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-r-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="modal-service-notes"
                className="block text-xs font-semibold text-[#0B1E38] mb-1.5"
              >
                Notes (Optional)
              </label>
              <input
                id="modal-service-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., 2nd floor bedroom or which tap/switch needs fixing"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-[#1E2430] focus:outline-2 focus:outline-[#1D6FF2]"
              />
            </div>
          </div>

          {selectedServiceForModal.available ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0B1E38] hover:bg-[#132F56] text-white text-sm font-semibold cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                type="button"
                onClick={handleBookImmediately}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1D6FF2] hover:bg-[#1558C7] text-white text-sm font-semibold cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-3 px-4 rounded-lg bg-slate-100 text-center text-sm font-medium text-slate-600">
              This service is currently unavailable for instant online selection. Please contact us at 0301 6800786.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
