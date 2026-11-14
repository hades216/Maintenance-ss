import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { ServiceCard } from '../components/ServiceCard';
import { Link, useDocumentMeta, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { buildWhatsAppBookingUrl, formatServicePrice } from '../utils/bookingLogic';
import { getCategoryTheme } from '../utils/themeGradients';

interface ServiceDetailPageProps {
  slug: string;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const { services, categories, cart, addToCart, settings } = useStore();

  const service = services.find((s) => s.slug === slug || s.id === slug);
  const category = categories.find((c) => c.slug === service?.categorySlug);
  const theme = getCategoryTheme(service?.categorySlug);

  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    setQty(1);
    setNotes('');
  }, [slug]);

  useDocumentMeta(
    service ? `${service.name} | KAAM FIX Rawalpindi` : 'Service Not Found | KAAM FIX',
    service
      ? service.detailedDescription
      : 'Browse all KAAM FIX home repair, maintenance, and renovation services in Rawalpindi.'
  );

  if (!service) {
    return (
      <div className="pt-28 pb-20 min-h-[70vh] bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-2xl mx-auto px-5 text-center space-y-5">
          <h1 className="font-display text-3xl font-bold text-[#0B1E38]">Service Not Found</h1>
          <p className="text-sm sm:text-base text-[#5A6475]">
            This service may have been updated or moved. Browse our full catalog to find what you need.
          </p>
          <Link
            to="/services"
            className="btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
          >
            <span>Browse All Services</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    );
  }

  const inCartItem = cart.find((c) => c.serviceId === service.id);
  const relatedServices = services
    .filter((s) => s.categorySlug === service.categorySlug && s.id !== service.id && s.available)
    .slice(0, 3);

  const singleWhatsAppUrl = buildWhatsAppBookingUrl(settings.whatsappNumber, {
    items: [
      {
        serviceId: service.id,
        serviceName: service.name,
        categorySlug: service.categorySlug,
        categoryName: category?.name || 'Home Services',
        pricingType: service.pricingType,
        pricePkr: service.pricePkr,
        unitLabel: service.unitLabel,
        quantity: qty,
        notes: notes.trim(),
        imageKey: service.imageKey,
        customImageUrl: service.customImageUrl,
      },
    ],
  });

  const handleAdd = () => {
    addToCart(service, qty, notes);
  };

  const handleBookNow = () => {
    addToCart(service, qty, notes, true);
    navigate('/book');
  };

  return (
    <div className="pt-16 md:pt-[72px] bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Top Category Accent Bar */}
      <div className={`h-1.5 w-full ${theme.accentBar}`} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5A6475] mb-6">
          <Link to="/" className="hover:text-[#0B1E38]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/services" className="hover:text-[#0B1E38]">
            Services
          </Link>
          {category && (
            <>
              <span aria-hidden="true">/</span>
              <Link to={`/services/${category.slug}`} className={`font-medium ${theme.textAccent} hover:underline`}>
                {category.name}
              </Link>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span className="text-[#0B1E38] font-medium truncate">{service.name}</span>
        </nav>

        {/* Main 2-Column Service Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          <div className="lg:col-span-6">
            <div className="h-full min-h-[300px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-slate-200 bg-[#F4F5F7] shadow-sm">
              <SafeImage
                imageKey={service.imageKey}
                customUrl={service.customImageUrl}
                alt={service.name}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5A6475]">
                <span className={`font-semibold ${theme.textAccent}`}>
                  {category?.name || 'Home Services'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{service.unitLabel}</span>
              </div>

              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight text-balance">
                {service.name}
              </h1>

              <div className={`mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl ${theme.softSurface} border border-slate-200/80`}>
                <span className="text-xs font-medium text-[#5A6475]">Pricing:</span>
                <span className="font-mono-num text-base font-bold text-[#0B1E38]">
                  {formatServicePrice(service.pricingType, service.pricePkr, 'short')}
                </span>
              </div>

              <p className="mt-5 text-base text-[#1E2430] leading-relaxed">
                {service.detailedDescription}
              </p>

              {category && category.highlights.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-[#5A6475] mb-3">
                    Included Care &amp; Workmanship
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#0B1E38]">
                    {category.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-7 pt-6 border-t border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Quantity ({service.unitLabel})
                  </label>
                  <div className="inline-flex items-center border border-slate-200 rounded-lg bg-[#F4F5F7]">
                    <button
                      type="button"
                      aria-label="Decrease service quantity"
                      onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-l-lg cursor-pointer transition-colors"
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
                      className="w-10 h-10 inline-flex items-center justify-center text-[#0B1E38] hover:bg-slate-200/70 rounded-r-lg cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="page-service-notes"
                    className="block text-xs font-semibold text-[#0B1E38] mb-1.5"
                  >
                    Notes (Optional)
                  </label>
                  <input
                    id="page-service-notes"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g., 2nd floor room or fixture detail"
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-[#F4F5F7] focus:bg-white text-sm text-[#1E2430] focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                </div>
              </div>

              {service.available ? (
                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAdd}
                      className={`group btn-animated inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap ${
                        inCartItem ? 'btn-grad-emerald' : 'btn-grad-dark'
                      }`}
                    >
                      {inCartItem ? (
                        <>
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span>In Cart ({inCartItem.quantity}) · Add More</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      className={`group btn-animated ${theme.buttonGradient} inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold cursor-pointer whitespace-nowrap shadow-md`}
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      href={singleWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-animated btn-grad-emerald inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Ask / Book on WhatsApp</span>
                    </a>
                    <a
                      href={`tel:+92${settings.phoneDisplay.replace(/\D/g, '').replace(/^0/, '')}`}
                      className="btn-animated inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-[#F4F5F7] hover:bg-slate-200/70 text-[#0B1E38] text-xs sm:text-sm font-semibold font-mono-num whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4 text-[#1D6FF2]" aria-hidden="true" />
                      <span>Call {settings.phoneDisplay}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-100 text-center text-sm font-medium text-slate-600">
                  Temporarily unavailable for online selection. Call us at {settings.phoneDisplay}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            to={category ? `/services/${category.slug}` : '/services'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1E38] hover:text-[#1D6FF2] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to {category?.name || 'All Services'}</span>
          </Link>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mt-14 pt-12 border-t border-slate-200">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
              <div>
                <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${theme.textAccent}`}>
                  More in {category?.shortName}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#0B1E38]">
                  Related Services You Can Add Together
                </h2>
              </div>
              <Link
                to="/cart"
                className="btn-animated btn-grad-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                <span>Go to Cart</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <ServiceCard
                  key={rel.id}
                  service={rel}
                  categoryName={category?.shortName || 'Home Service'}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
