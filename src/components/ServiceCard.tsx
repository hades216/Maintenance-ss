import React from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import type { ServiceItem } from '../types/kaamfix';
import { formatServicePrice } from '../utils/bookingLogic';
import { getCategoryTheme } from '../utils/themeGradients';
import { SafeImage } from './SafeImage';

interface ServiceCardProps {
  service: ServiceItem;
  categoryName: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, categoryName }) => {
  const { navigate } = useRouter();
  const { cart, addToCart } = useStore();
  const inCartItem = cart.find((c) => c.serviceId === service.id);
  const theme = getCategoryTheme(service.categorySlug);

  const handleBookNow = () => {
    if (!inCartItem) {
      addToCart(service, 1, '', true);
    }
    navigate('/book');
  };

  return (
    <article
      className={`group bg-white border border-slate-200 ${theme.borderHover} rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className={`h-1 w-full ${theme.accentBar}`} />

      <Link
        to={`/service/${service.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-[#F4F5F7] block"
      >
        <SafeImage
          imageKey={service.imageKey}
          customUrl={service.customImageUrl}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5A6475] mb-1.5">
          <span className={`font-semibold ${theme.textAccent}`}>{categoryName}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-num text-[#0B1E38] font-semibold">
            {formatServicePrice(service.pricingType, service.pricePkr, 'short')}
          </span>
        </div>

        <h3 className="font-display text-lg font-bold text-[#0B1E38] leading-snug">
          <Link to={`/service/${service.slug}`} className="hover:text-[#1D6FF2] transition-colors">
            {service.name}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-[#5A6475] leading-relaxed flex-1">
          {service.shortDescription}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/service/${service.slug}`}
              className={`text-xs font-semibold ${theme.textAccent} hover:underline underline-offset-4`}
            >
              View Service Page →
            </Link>
            <span className="text-xs text-[#5A6475]">{service.unitLabel}</span>
          </div>

          {service.available ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addToCart(service, 1)}
                className={`btn-animated inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap ${
                  inCartItem
                    ? 'btn-grad-emerald'
                    : 'bg-gradient-to-r from-slate-100 to-slate-200/80 hover:from-slate-200 hover:to-slate-200 text-[#0B1E38] border border-slate-200'
                }`}
              >
                {inCartItem ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>In Cart ({inCartItem.quantity})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBookNow}
                className={`btn-animated ${theme.buttonGradient} inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap shadow-xs`}
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="py-2 px-3 rounded-lg bg-slate-100 text-center text-xs font-medium text-slate-500">
              Temporarily Unavailable — Contact for Inquiry
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
