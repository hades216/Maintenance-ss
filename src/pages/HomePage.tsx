import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Compass,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Star,
  UserCheck,
  Wallet,
  Wrench,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ParallaxBanner, Reveal } from '../components/ParallaxSection';
import { SafeImage } from '../components/SafeImage';
import { ServiceCard } from '../components/ServiceCard';
import { Link, useDocumentMeta, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';
import { HERO_SLIDES } from '../data/media';
import { getCategoryTheme } from '../utils/themeGradients';

export const HomePage: React.FC = () => {
  useDocumentMeta(
    'KAAM FIX — Har Kaam, Ek Fix. | Home Services & Construction Rawalpindi',
    BUSINESS_INFO.description
  );

  const { navigate } = useRouter();
  const { categories, services, settings } = useStore();
  const shouldReduceMotion = useReducedMotion();
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, []);

  const featuredServices = services.filter((s) => s.featured && s.available).slice(0, 6);
  const telHref = `tel:+92${settings.phoneDisplay.replace(/\D/g, '').replace(/^0/, '')}`;

  const trustIcons = [UserCheck, ShieldCheck, Wallet, Compass];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Choose Your Services',
      description:
        'Pick from electrical, plumbing, carpentry, painting, civil work, general repairs, or renovation.',
      icon: ClipboardList,
    },
    {
      step: '02',
      title: 'Add to Your Cart',
      description:
        'Add all the jobs you need at home into one simple booking cart.',
      icon: ShoppingCart,
    },
    {
      step: '03',
      title: 'Schedule Your Visit',
      description:
        'Share your Rawalpindi address, preferred day and time, and a few details or photos of the job.',
      icon: CalendarCheck,
    },
    {
      step: '04',
      title: 'Get Your Work Done',
      description:
        'Our team calls to confirm the timing and price, then sends the right worker to your home.',
      icon: Wrench,
    },
  ];

  return (
    <div>
      {/* B. Full-Screen Cinematic Hero — EXACTLY THREE IMAGES */}
      <section
        aria-label="Featured services"
        className="relative min-h-[85vh] md:min-h-screen flex items-center bg-[#071426] text-white overflow-hidden"
      >
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, idx) => {
            const active = idx === heroIndex;
            return (
              <motion.div
                key={slide.imageKey}
                initial={false}
                animate={{
                  opacity: active ? 1 : 0,
                  scale: shouldReduceMotion ? 1 : active ? 1.06 : 1,
                }}
                transition={{
                  opacity: { duration: 1.2, ease: 'easeInOut' },
                  scale: { duration: 6.5, ease: 'easeOut' },
                }}
                style={{ zIndex: active ? 1 : 0 }}
                className="absolute inset-0 will-change-transform"
                aria-hidden={!active}
              >
                <SafeImage
                  imageKey={slide.imageKey}
                  alt={slide.alt}
                  priority={idx === 0}
                  className="w-full h-full object-cover object-center"
                />
              </motion.div>
            );
          })}
          {/* Measured multi-tone atmospheric scrim */}
          <div
            className="absolute inset-0 z-10 bg-gradient-to-r from-[#071426]/95 via-[#0B2347]/84 to-[#0D5E6B]/55"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 z-10 bg-gradient-to-t from-[#071426]/85 via-[#071426]/20 to-[#1E1B4B]/45"
            aria-hidden="true"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-14 md:pt-28 md:pb-20 w-full">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase bg-gradient-to-r from-[#38BDF8] via-[#34D399] to-[#FBBF24] bg-clip-text text-transparent inline-block">
              KAAM FIX — YOUR HOME SERVICES PARTNER
            </p>

            <h1 className="mt-2.5 sm:mt-3 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.08]">
              Har Kaam,{' '}
              <span className="bg-gradient-to-r from-[#60A5FA] via-[#2DD4BF] to-[#FBBF24] bg-clip-text text-transparent">
                Ek Fix.
              </span>
            </h1>

            <p className="mt-3.5 sm:mt-4 font-display text-lg sm:text-xl md:text-2xl font-medium text-white/95 text-balance max-w-2xl">
              From everyday home repairs to complete home improvements, find the right
              professional for every job.
            </p>

            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-white/85 max-w-xl leading-relaxed">
              Electrical, plumbing, carpentry, painting and construction services — delivered to
              your doorstep.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="group btn-animated btn-grad-primary inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/book')}
                className="btn-animated btn-grad-light inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Book a Service</span>
              </button>

              <a
                href={telHref}
                className="btn-animated btn-grad-glass inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-lg text-sm sm:text-base font-semibold whitespace-nowrap shrink-0 font-mono-num"
              >
                <Phone className="w-4 h-4 text-[#FBBF24]" aria-hidden="true" />
                <span>Call {settings.phoneDisplay}</span>
              </a>
            </div>

            {/* Slide Indicator & Caption */}
            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.imageKey}
                    type="button"
                    role="tab"
                    aria-selected={idx === heroIndex}
                    aria-label={`View slide ${idx + 1}: ${slide.caption}`}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === heroIndex ? 'w-8 bg-[#60A5FA]' : 'w-3 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={HERO_SLIDES[heroIndex].imageKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-xs text-white/75 hidden sm:inline"
                >
                  {HERO_SLIDES[heroIndex].caption}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Subtle Scroll-Down Indicator */}
        <a
          href="#trust-strip"
          aria-label="Scroll down to highlights"
          className="hidden md:inline-flex flex-col items-center gap-1.5 absolute bottom-7 left-1/2 -translate-x-1/2 z-20 text-white/70 hover:text-white transition-colors"
        >
          <span className="text-[11px] font-medium tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-4 h-4 animate-bounce" aria-hidden="true" />
        </a>
      </section>

      {/* C. Trust & Service Highlights Strip */}
      <section
        id="trust-strip"
        className="bg-gradient-to-r from-slate-50 via-sky-50/60 to-amber-50/40 border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BUSINESS_INFO.promises.map((promise, idx) => {
              const Icon = trustIcons[idx];
              const badgeGradients = [
                'from-[#1D6FF2] to-[#06B6D4]',
                'from-[#0F766E] to-[#10B981]',
                'from-[#D97706] to-[#EA580C]',
                'from-[#E11D48] to-[#6366F1]',
              ];
              return (
                <div key={promise.title} className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${badgeGradients[idx % badgeGradients.length]} text-white flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="font-display text-sm font-bold text-[#0B1E38]">
                      {promise.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-[#5A6475] leading-relaxed">
                      {promise.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* D. Introduction Split-Screen Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
            <Reveal className="lg:col-span-6">
              <div className="h-full min-h-[340px] lg:min-h-[480px] rounded-2xl overflow-hidden bg-[#F4F5F7]">
                <SafeImage
                  imageKey="intro_home_solution"
                  alt="Pristine modern residential living room finished with custom woodwork, painting, and lighting"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
                Ghar Ka Har Kaam, Asaan
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight text-balance">
                Every Home Problem. One Reliable Solution.
              </h2>
              <p className="mt-4 text-base text-[#5A6475] leading-relaxed">
                At Kaam Fix, we make home maintenance and improvement easier by connecting
                customers with professionals for everyday repairs, installations and home
                improvement projects.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-slate-200">
                {[
                  { label: 'Electrical solutions', to: '/services/electrical' },
                  { label: 'Plumbing repairs', to: '/services/plumbing' },
                  { label: 'Carpentry', to: '/services/carpentry' },
                  { label: 'Painting', to: '/services/painting' },
                  { label: 'Civil work', to: '/services/civil-work' },
                  { label: 'General home maintenance', to: '/services/home-maintenance' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#F4F5F7] hover:bg-slate-200/70 text-sm font-semibold text-[#0B1E38] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#1D6FF2]" aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/about"
                  className="group btn-animated btn-grad-dark inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold"
                >
                  <span>Discover Kaam Fix</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* E. Main Services Showcase — 7 Distinct Categories */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#F4F5F7] via-sky-50/35 to-amber-50/25 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#0D9488]">
                Our Services
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight text-balance">
                Complete Home Services Under One Roof
              </h2>
              <p className="mt-3 text-base text-[#5A6475]">
                Pick any trade below or add jobs from different categories together into one cart.
              </p>
            </div>
            <Link
              to="/services"
              className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold self-start md:self-auto whitespace-nowrap"
            >
              <span>Browse All Services</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const theme = getCategoryTheme(cat.slug);
              return (
                <Reveal
                  key={cat.slug}
                  delay={idx * 0.05}
                  className={idx === 6 ? 'md:col-span-2 lg:col-span-3' : ''}
                >
                  <div
                    className={`group bg-white border border-slate-200 ${theme.borderHover} rounded-xl overflow-hidden h-full flex ${
                      idx === 6 ? 'flex-col lg:flex-row' : 'flex-col'
                    } hover:-translate-y-1 hover:shadow-lg transition-all duration-200`}
                  >
                    <div
                      className={`relative overflow-hidden bg-[#0B1E38] ${
                        idx === 6 ? 'lg:w-1/2 aspect-[4/3] lg:aspect-auto lg:min-h-[300px]' : 'aspect-[4/3]'
                      }`}
                    >
                      <div className={`absolute top-0 inset-x-0 h-1.5 z-10 ${theme.accentBar}`} />
                      <SafeImage
                        imageKey={cat.imageKey}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <p className={`text-xs font-semibold ${theme.textAccent}`}>
                          0{idx + 1}. {cat.shortName}
                        </p>
                        <h3 className="mt-1 font-display text-xl font-bold text-[#0B1E38]">
                          {cat.name}
                        </h3>
                        <p className="mt-2 text-sm text-[#5A6475] leading-relaxed">
                          {cat.description}
                        </p>
                        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#1E2430]">
                          {cat.highlights.map((h) => (
                            <li key={h} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0" aria-hidden="true" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <Link
                          to={`/services/${cat.slug}`}
                          className={`group/btn btn-animated ${theme.buttonGradient} inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-xs whitespace-nowrap`}
                        >
                          <span>Explore {cat.shortName}</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Multi-Service Catalog Preview (Add to Cart directly from Home) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
                Popular Services
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight text-balance">
                Add Multiple Jobs to One Cart
              </h2>
              <p className="mt-3 text-base text-[#5A6475]">
                Need an electrician, a plumber, and a carpenter in the same week? Add everything to
                your cart and book them all together.
              </p>
            </div>
            <Link
              to="/cart"
              className="btn-animated btn-grad-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold self-start md:self-auto whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
              <span>Review Service Cart</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service) => {
              const cat = categories.find((c) => c.slug === service.categorySlug);
              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  categoryName={cat?.shortName || 'Home Service'}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Parallax Feature Break */}
      <ParallaxBanner
        imageKey="service_renovation"
        alt="Kitchen and living area renovation work in progress"
        eyebrow="One Team for Everything"
        eyebrowClass="text-[#FBBF24]"
        overlayGradient="bg-gradient-to-r from-[#071426]/92 via-[#1E293B]/80 to-[#B45309]/50"
        title="Repairs and Renovations Without Dealing With Multiple Contractors."
        description="Whether you have a leaking kitchen tap, need a ceiling fan fitted, want a room painted, or need tile work, we handle it on one schedule with clear updates."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              to="/services"
              className="group btn-animated btn-grad-warm inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <span>Browse All Services</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/our-work"
              className="btn-animated btn-grad-glass inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <span>See Our Work</span>
            </Link>
          </div>
        }
      />

      {/* Section 6: How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#EA580C]">
                How It Works
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight text-balance">
                Four Simple Steps From Selection to Completion
              </h2>
            </div>
            <Link
              to="/how-it-works"
              className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold self-start md:self-auto whitespace-nowrap"
            >
              <span>Full Guide</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((item, idx) => {
              const Icon = item.icon;
              const stepGradients = [
                'from-[#1D6FF2] to-[#06B6D4]',
                'from-[#0F766E] to-[#10B981]',
                'from-[#D97706] to-[#EA580C]',
                'from-[#E11D48] to-[#6366F1]',
              ];
              return (
                <Reveal key={item.step} delay={idx * 0.08}>
                  <div className="h-full p-6 rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-100/70 border border-slate-200 flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-5">
                      <span className={`font-mono-num text-2xl font-bold bg-gradient-to-r ${stepGradients[idx]} bg-clip-text text-transparent`}>
                        {item.step}
                      </span>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stepGradients[idx]} text-white flex items-center justify-center shadow-xs`}>
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#0B1E38]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#5A6475] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 7: Why Choose KAAM FIX & Verified Google Reviews Strip */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#071426] via-[#0B1E38] to-[#0F3F52] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#34D399]">
                Why Choose KAAM FIX
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
                One Team. Every Home Repair.
              </h2>
              <p className="mt-4 text-base text-white/80 leading-relaxed max-w-2xl">
                {BUSINESS_INFO.description}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Skilled Workers',
                  'On-Time Visits',
                  'Clear Pricing Before Work Starts',
                  'Doorstep Service in Rawalpindi',
                  'Book Multiple Jobs Together',
                  'Easy Call & WhatsApp Updates',
                  'Everyday Repairs & Full Renovations',
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" aria-hidden="true" />
                    <span className="text-sm font-medium text-white">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-7 rounded-2xl bg-gradient-to-br from-white via-white to-sky-50/80 text-[#1E2430] shadow-xl">
                <div className="flex items-center gap-2 text-[#D97706] text-xs font-semibold uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
                  <span>Google Business Profile</span>
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold text-[#0B1E38]">
                  6 Google Reviews Listed
                </h3>
                <p className="mt-2.5 text-sm text-[#5A6475] leading-relaxed">
                  We currently have {BUSINESS_INFO.googleReviewsCount} reviews listed on Google. We
                  only display real feedback from customers and never invent ratings.
                </p>

                <div className="mt-6 pt-5 border-t border-slate-200 space-y-3 text-sm">
                  <div>
                    <span className="text-xs font-medium text-[#5A6475] block">Address</span>
                    <span className="font-medium text-[#0B1E38]">{settings.address}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[#5A6475] block">Business Hours</span>
                    <span className="font-medium text-[#0B1E38]">{settings.hours}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/reviews"
                    className="group btn-animated btn-grad-dark inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
                  >
                    <span>Customer Reviews</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/service-areas"
                    className="btn-animated inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-[#0B1E38] text-sm font-semibold whitespace-nowrap"
                  >
                    Check Service Areas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Parallax Section — Ready to Book */}
      <ParallaxBanner
        imageKey="service_civil_work"
        alt="Craftsman laying precision floor tiles during a home improvement project"
        eyebrow="Rawalpindi & Nearby Areas"
        eyebrowClass="text-[#34D399]"
        overlayGradient="bg-gradient-to-r from-[#071426]/92 via-[#0B2A4A]/80 to-[#059669]/50"
        title="Whatever Needs Fixing in Your Home, Start With KAAM FIX."
        description="Your Home. Our Responsibility. One Simple Solution. Select your services or speak directly with our Rawalpindi team today."
        heightClass="min-h-[380px]"
        action={
          <div className="flex flex-wrap gap-3.5">
            <Link
              to="/book"
              className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <span>Book a Service Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-animated btn-grad-emerald inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <span>Message on WhatsApp</span>
            </a>
          </div>
        }
      />
    </div>
  );
};
