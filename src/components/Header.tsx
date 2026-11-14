import React, { useEffect, useState } from 'react';
import { ChevronDown, Menu, ShoppingCart, X, Phone } from 'lucide-react';
import { Link, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { BrandMark } from './BrandMark';
import { getCategoryTheme } from '../utils/themeGradients';

export const Header: React.FC = () => {
  const { pathname, navigate } = useRouter();
  const { categories, cartSummary, setCartDrawerOpen, settings } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const useLightHeader = isHome && !scrolled && !mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const navLinkClass = `text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
    useLightHeader
      ? 'text-white/90 hover:text-white border-transparent hover:border-white/70'
      : 'text-[#1E2430] hover:text-[#1D6FF2] border-transparent hover:border-[#1D6FF2]'
  }`;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          useLightHeader
            ? 'bg-gradient-to-b from-[#071426]/80 to-transparent border-b border-white/10'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-[72px] flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link to="/" aria-label="KAAM FIX Home" className="shrink-0 focus-visible:outline-2 focus-visible:outline-[#1D6FF2] rounded-sm">
            <BrandMark variant={useLightHeader ? 'light' : 'dark'} />
          </Link>

          {/* Zone 2: Primary Single-Line Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6"
          >
            <Link to="/" className={navLinkClass}>
              Home
            </Link>
            <Link to="/about" className={navLinkClass}>
              About
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 ${
                  useLightHeader
                    ? 'text-white/90 hover:text-white'
                    : 'text-[#1E2430] hover:text-[#1D6FF2]'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {servicesOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-full pt-2 w-80 z-50"
                >
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xl py-2 overflow-hidden">
                    <Link
                      to="/services"
                      role="menuitem"
                      className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-[#0B1E38] hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border-b border-slate-100"
                    >
                      <span>All Services Catalog</span>
                      <span className="text-xs font-medium text-[#1D6FF2]">Browse All</span>
                    </Link>
                    <div className="py-1">
                      {categories.map((cat) => {
                        const catTheme = getCategoryTheme(cat.slug);
                        return (
                          <Link
                            key={cat.slug}
                            to={`/services/${cat.slug}`}
                            role="menuitem"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#1E2430] hover:bg-slate-50 hover:text-[#0B1E38] transition-colors"
                          >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${catTheme.accentBar}`} aria-hidden="true" />
                            <span>{cat.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-1 pt-2 px-4 pb-2 border-t border-slate-100 bg-slate-50/80 grid grid-cols-2 gap-1.5 text-xs font-medium text-[#5A6475]">
                      <Link to="/service-areas" className="py-1 hover:text-[#1D6FF2]">
                        Service Areas
                      </Link>
                      <Link to="/reviews" className="py-1 hover:text-[#1D6FF2]">
                        Customer Reviews
                      </Link>
                      <Link to="/faqs" className="py-1 hover:text-[#1D6FF2]">
                        FAQs
                      </Link>
                      <Link to="/cart" className="py-1 hover:text-[#1D6FF2]">
                        Service Cart
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link to="/our-work" className={navLinkClass}>
              Our Work
            </Link>
            <Link to="/how-it-works" className={navLinkClass}>
              How It Works
            </Link>
            <Link to="/contact" className={navLinkClass}>
              Contact
            </Link>
          </nav>

          {/* Zone 3: Cart & Primary Booking CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Open service cart (${cartSummary.totalUnits} items)`}
              data-testid="header-cart-button"
              className={`btn-animated relative inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                useLightHeader
                  ? 'text-white bg-white/10 hover:bg-white/20 border border-white/25'
                  : 'text-[#0B1E38] bg-[#F4F5F7] hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span
                data-testid="header-cart-count"
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-md bg-gradient-to-r from-[#1D6FF2] to-[#0D9488] text-white text-xs font-semibold font-mono-num"
              >
                {cartSummary.totalUnits}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/book')}
              className="btn-animated btn-grad-primary hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book a Service
            </button>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors cursor-pointer ${
                useLightHeader
                  ? 'text-white bg-white/10 hover:bg-white/20'
                  : 'text-[#0B1E38] bg-[#F4F5F7] hover:bg-slate-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex justify-end bg-[#071426]/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
              <BrandMark variant="dark" />
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 inline-flex items-center justify-center rounded-lg bg-[#F4F5F7] text-[#0B1E38]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#1D6FF2] text-white text-sm font-semibold text-center"
                >
                  Book a Service
                </Link>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#0B1E38] text-white text-sm font-semibold text-center"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart ({cartSummary.totalUnits})</span>
                </Link>
              </div>

              <nav className="space-y-1">
                <Link to="/" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  Home
                </Link>
                <Link to="/about" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  About Kaam Fix
                </Link>
                <Link to="/services" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  All Services
                </Link>
                <div className="pl-4 space-y-1 border-l border-slate-200 ml-3 my-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/services/${cat.slug}`}
                      className="block px-3 py-1.5 text-sm text-[#5A6475] hover:text-[#1D6FF2]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link to="/our-work" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  Our Work
                </Link>
                <Link to="/how-it-works" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  How It Works
                </Link>
                <Link to="/reviews" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  Customer Reviews
                </Link>
                <Link to="/service-areas" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  Service Areas
                </Link>
                <Link to="/faqs" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  FAQs
                </Link>
                <Link to="/contact" className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B1E38] hover:bg-[#F4F5F7]">
                  Contact Us
                </Link>
                <Link to="/admin" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#5A6475] hover:bg-[#F4F5F7]">
                  Admin Portal
                </Link>
              </nav>
            </div>

            <div className="p-5 border-t border-slate-200 bg-[#F4F5F7]">
              <a
                href={`tel:${settings.phoneDisplay.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white border border-slate-200 text-sm font-semibold text-[#0B1E38]"
              >
                <Phone className="w-4 h-4 text-[#1D6FF2]" />
                <span>Call {settings.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
