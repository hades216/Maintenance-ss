import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { Link } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { BrandMark } from './BrandMark';

export const Footer: React.FC = () => {
  const { categories, settings } = useStore();
  const telHref = `tel:+92${settings.phoneDisplay.replace(/\D/g, '').replace(/^0/, '')}`;

  return (
    <footer className="bg-gradient-to-b from-[#071426] via-[#071426] to-[#040D1A] text-white border-t border-white/10">
      <div className="h-1 w-full bg-[linear-gradient(90deg,#1D6FF2_0%,#0EA5E9_35%,#10B981_70%,#F59E0B_100%)]" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" aria-label="KAAM FIX Home">
              <BrandMark variant="light" />
            </Link>
            <p className="text-sm font-medium text-[#60A5FA]">
              Har Kaam, Ek Fix. · Ghar Ka Har Kaam, Asaan.
            </p>
            <p className="text-sm text-white/75 leading-relaxed">
              Your Home. Our Responsibility. One Simple Solution. Doorstep electrical, plumbing,
              carpentry, painting, civil work, and renovation services in Rawalpindi.
            </p>
            <div className="pt-1">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-white/85 hover:text-white underline underline-offset-4"
              >
                Official Facebook Page
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-white/60 mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="text-white/80 hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/services/${cat.slug}`}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Booking Column */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-white/60 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-white/80 hover:text-white transition-colors">
                  About Kaam Fix
                </Link>
              </li>
              <li>
                <Link to="/our-work" className="text-white/80 hover:text-white transition-colors">
                  Our Work / Gallery
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-white/80 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-white/80 hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/service-areas" className="text-white/80 hover:text-white transition-colors">
                  Service Areas
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-white/80 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-white/80 hover:text-white transition-colors">
                  Book a Service
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-white/80 hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide uppercase text-white/60 mb-4">
              Rawalpindi Office
            </h3>
            <ul className="space-y-3.5 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#60A5FA] shrink-0" aria-hidden="true" />
                <a href={telHref} className="hover:text-white font-mono-num">
                  {settings.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{settings.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} KAAM FIX. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/admin" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
