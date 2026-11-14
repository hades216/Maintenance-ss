import React from 'react';
import { ArrowRight, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { ParallaxBanner } from '../components/ParallaxSection';
import { SafeImage } from '../components/SafeImage';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';

export const AboutPage: React.FC = () => {
  useDocumentMeta(
    'About KAAM FIX | Home Maintenance & Repairs in Rawalpindi',
    BUSINESS_INFO.description
  );

  const { settings } = useStore();

  return (
    <div className="pt-16 md:pt-[72px]">
      <ParallaxBanner
        imageKey="intro_home_solution"
        alt="Modern home interior maintained by KAAM FIX"
        eyebrow="About KAAM FIX"
        eyebrowClass="text-[#FBBF24]"
        overlayGradient="bg-gradient-to-r from-[#071426]/94 via-[#1E293B]/82 to-[#B45309]/50"
        title="Making Home Maintenance Easier for Everyone."
        description="Har Kaam, Ek Fix. Ghar Ka Har Kaam, Asaan. Trusted doorstep repair, maintenance, and construction services in Rawalpindi."
        heightClass="min-h-[360px]"
      />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
                  Who We Are
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-[#0B1E38] tracking-tight">
                  Reliable Help for Everyday Home Repairs
                </h2>
                <p className="mt-4 text-base text-[#5A6475] leading-relaxed">
                  {BUSINESS_INFO.description}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 space-y-4">
                <h3 className="font-display text-xl font-bold text-[#0B1E38]">
                  Why Homeowners Choose Us
                </h3>
                <p className="text-sm sm:text-base text-[#5A6475] leading-relaxed">
                  You shouldn&apos;t have to call five different numbers just to get a few things
                  fixed at home. With KAAM FIX, you can pick everything you need—electrical,
                  plumbing, carpentry, painting, or general repair work—into one cart and talk with
                  one team from start to finish.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    'Skilled Workers',
                    '7 Home Trades Covered',
                    'Doorstep Visits',
                    'Clear Communication',
                    'Quality Workmanship',
                    'Customer Satisfaction',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm font-medium text-[#0B1E38]">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="btn-animated btn-grad-warm inline-flex items-center px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className="btn-animated inline-flex items-center px-6 py-3 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-[#0B1E38] text-sm font-semibold whitespace-nowrap"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-[#F4F5F7]">
                <SafeImage
                  imageKey="service_maintenance"
                  alt="KAAM FIX technician fixing a home door hinge"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 rounded-xl bg-[#F4F5F7] border border-slate-200 space-y-3 text-sm">
                <h3 className="font-display text-base font-bold text-[#0B1E38]">
                  Rawalpindi Office
                </h3>
                <p className="flex items-start gap-2.5 text-[#5A6475]">
                  <MapPin className="w-4 h-4 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{settings.address}</span>
                </p>
                <p className="flex items-center gap-2.5 text-[#5A6475]">
                  <Phone className="w-4 h-4 text-[#1D6FF2] shrink-0" aria-hidden="true" />
                  <span className="font-mono-num font-semibold text-[#0B1E38]">
                    {settings.phoneDisplay}
                  </span>
                  <span>· {settings.hours}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
