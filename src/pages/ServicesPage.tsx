import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Search, ShoppingCart } from 'lucide-react';
import { ParallaxBanner } from '../components/ParallaxSection';
import { ServiceCard } from '../components/ServiceCard';
import { Link, useDocumentMeta, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import type { ServiceCategorySlug } from '../types/kaamfix';
import { getCategoryTheme } from '../utils/themeGradients';

interface ServicesPageProps {
  categorySlug?: ServiceCategorySlug;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ categorySlug }) => {
  const { navigate } = useRouter();
  const { categories, services, cartSummary } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ServiceCategorySlug>(
    categorySlug || 'all'
  );

  // Sync filter when route changes between /services and /services/:slug
  React.useEffect(() => {
    setActiveFilter(categorySlug || 'all');
  }, [categorySlug]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const activeTheme = activeCategory ? getCategoryTheme(activeCategory.slug) : null;

  useDocumentMeta(
    activeCategory
      ? `${activeCategory.name} | KAAM FIX Rawalpindi`
      : 'All Home Services | KAAM FIX Rawalpindi',
    activeCategory
      ? activeCategory.description
      : 'Browse all KAAM FIX electrical, plumbing, carpentry, painting, civil work, home maintenance, and renovation services.'
  );

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory =
        activeFilter === 'all' || service.categorySlug === activeFilter;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        service.name.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        service.detailedDescription.toLowerCase().includes(query)
      );
    });
  }, [services, activeFilter, searchQuery]);

  const handleCategoryTabClick = (slug: 'all' | ServiceCategorySlug) => {
    setActiveFilter(slug);
    if (slug === 'all') {
      navigate('/services');
    } else {
      navigate(`/services/${slug}`);
    }
  };

  return (
    <div className="pt-16 md:pt-[72px]">
      <ParallaxBanner
        imageKey={activeCategory ? activeCategory.imageKey : 'hero_renovation'}
        alt={activeCategory ? activeCategory.name : 'KAAM FIX Complete Home Services'}
        eyebrow={activeCategory ? `KAAM FIX · ${activeCategory.shortName}` : 'KAAM FIX Service Catalog'}
        eyebrowClass={activeTheme ? activeTheme.eyebrowColor : 'text-[#38BDF8]'}
        overlayGradient={
          activeTheme
            ? activeTheme.bannerOverlay
            : 'bg-gradient-to-r from-[#071426]/95 via-[#0F2A4D]/84 to-[#0D9488]/55'
        }
        title={activeCategory ? activeCategory.name : 'All Home Maintenance & Construction Services'}
        description={
          activeCategory
            ? activeCategory.description
            : 'Pick the services you need from any trade, add them to one cart, and book them together.'
        }
        heightClass="min-h-[340px] md:min-h-[390px]"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/cart"
              className="btn-animated btn-grad-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              <span>View Cart ({cartSummary.totalUnits})</span>
            </Link>
            <Link
              to="/book"
              className="group btn-animated btn-grad-light inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        }
      />

      {/* Category Highlights when viewing a dedicated category page */}
      {activeCategory && activeTheme && (
        <section className={`${activeTheme.softSurface} border-b border-slate-200`}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeCategory.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-white/95 border border-slate-200/90 text-sm font-medium text-[#0B1E38] shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter Toolbar & Catalog Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F5F7] p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => handleCategoryTabClick('all')}
                className={`btn-animated px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer ${
                  activeFilter === 'all'
                    ? 'btn-grad-dark'
                    : 'text-[#5A6475] hover:text-[#0B1E38] hover:bg-white/60'
                }`}
              >
                All Services
              </button>
              {categories.map((cat) => {
                const catTheme = getCategoryTheme(cat.slug);
                const isSelected = activeFilter === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleCategoryTabClick(cat.slug)}
                    className={`btn-animated px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer ${
                      isSelected
                        ? `${catTheme.buttonGradient} shadow-xs`
                        : 'text-[#5A6475] hover:text-[#0B1E38] hover:bg-white/70'
                    }`}
                  >
                    {cat.shortName}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search
                className="w-4 h-4 text-[#5A6475] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search services"
                placeholder="Search services..."
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-[#F4F5F7] focus:bg-white text-sm text-[#1E2430] focus:outline-2 focus:outline-[#1D6FF2]"
              />
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-16 px-4">
              <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                No matching services found
              </h2>
              <p className="mt-2 text-sm text-[#5A6475]">
                Try clearing your search or switching to All Services, or contact us directly for a
                custom home repair request.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  handleCategoryTabClick('all');
                }}
                className="btn-animated btn-grad-primary mt-5 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const cat = categories.find((c) => c.slug === service.categorySlug);
                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    categoryName={cat?.name || 'Home Service'}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
