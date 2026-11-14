import React from 'react';
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Phone,
  ShoppingCart,
  Wrench,
} from 'lucide-react';
import { ParallaxBanner, Reveal } from '../components/ParallaxSection';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';

export const HowItWorksPage: React.FC = () => {
  useDocumentMeta(
    'How It Works | KAAM FIX Rawalpindi',
    'See how easy it is to pick multiple home services, add them to one cart, and book a visit with KAAM FIX in Rawalpindi.'
  );

  const { settings, cartSummary } = useStore();
  const telHref = `tel:+92${settings.phoneDisplay.replace(/\D/g, '').replace(/^0/, '')}`;

  const steps = [
    {
      num: '01',
      title: 'Browse & Choose Your Services',
      description:
        'Open any service category—electrical, plumbing, carpentry, painting, civil work, maintenance, or renovation—and select the jobs you need.',
      tip: 'You can pick fixed-price repairs, starting-price jobs, or quote-based visits.',
      gradient: 'from-[#1D6FF2] to-[#06B6D4]',
      softBg: 'from-blue-50/90 to-cyan-50/70',
      icon: ClipboardList,
    },
    {
      num: '02',
      title: 'Add Everything Into One Cart',
      description:
        'Put all your household tasks into a single cart—even if you need an electrician, a plumber, and a carpenter. Adjust quantities and add room notes.',
      tip: 'Your cart stays saved in your browser while you browse different pages.',
      gradient: 'from-[#0F766E] to-[#10B981]',
      softBg: 'from-teal-50/90 to-emerald-50/70',
      icon: ShoppingCart,
    },
    {
      num: '03',
      title: 'Pick Your Address, Date & Time',
      description:
        'Fill in our quick 5-step booking form with your Rawalpindi address, preferred day and time window, and optional photos of the issue.',
      tip: 'Or send your full cart directly to our WhatsApp in one tap.',
      gradient: 'from-[#D97706] to-[#EA580C]',
      softBg: 'from-amber-50/90 to-orange-50/70',
      icon: CalendarCheck,
    },
    {
      num: '04',
      title: 'We Confirm & Send the Right Team',
      description:
        'Our team calls or messages you to confirm availability and pricing before starting. Then skilled workers arrive at your doorstep with the right tools.',
      tip: 'Working hours: Saturday–Friday, 8:30 AM–10:00 PM.',
      gradient: 'from-[#E11D48] to-[#6366F1]',
      softBg: 'from-rose-50/90 to-indigo-50/70',
      icon: Wrench,
    },
  ];

  const pricingGuides = [
    {
      title: 'Fixed Price Services',
      badgeClass: 'bg-gradient-to-r from-[#15803D] to-[#0D9488] text-white',
      barClass: 'bg-gradient-to-r from-[#15803D] to-[#10B981]',
      text: 'Simple standard tasks show a clear fixed price per item, so you know the exact cost up front.',
    },
    {
      title: 'Starting From Pricing',
      badgeClass: 'bg-gradient-to-r from-[#1D6FF2] to-[#0EA5E9] text-white',
      barClass: 'bg-gradient-to-r from-[#1D6FF2] to-[#06B6D4]',
      text: 'Shows the base starting price. Final cost depends on parts, wiring length, or job size and is always shared before work starts.',
    },
    {
      title: 'Price on Request',
      badgeClass: 'bg-gradient-to-r from-[#D97706] to-[#EA580C] text-white',
      barClass: 'bg-gradient-to-r from-[#D97706] to-[#EA580C]',
      text: 'Larger repairs, tile work, painting, and renovations are quoted fairly after reviewing your details, photos, or an inspection visit.',
    },
  ];

  return (
    <div className="pt-16 md:pt-[72px]">
      <ParallaxBanner
        imageKey="service_carpentry"
        alt="Technician measuring and preparing home repair tools"
        eyebrow="Simple 4-Step Process"
        eyebrowClass="text-[#38BDF8]"
        overlayGradient="bg-gradient-to-r from-[#071426]/95 via-[#0F2A4D]/84 to-[#0D9488]/55"
        title="How KAAM FIX Works"
        description="Book one job or combine several repairs across trades in a single request—online or on WhatsApp."
        heightClass="min-h-[340px] md:min-h-[390px]"
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              to="/services"
              className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0"
            >
              <span>Browse Services</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/cart"
              className="btn-animated btn-grad-glass inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0"
            >
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              <span>Service Cart ({cartSummary.totalUnits})</span>
            </Link>
          </div>
        }
      />

      {/* 4 Detailed Steps */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white via-slate-50/60 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#0D9488]">
              Step by Step
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight text-balance">
              From Picking Jobs to Getting Them Fixed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.num} delay={idx * 0.06}>
                  <div className={`h-full rounded-2xl border border-slate-200 bg-gradient-to-br ${s.softBg} p-7 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 hover:shadow-md`}>
                    <div>
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <span
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-sm`}
                        >
                          <Icon className="w-6 h-6" aria-hidden="true" />
                        </span>
                        <span className="font-mono-num text-3xl font-extrabold text-[#0B1E38]/15">
                          {s.num}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-[#0B1E38]">{s.title}</h3>
                      <p className="mt-2.5 text-sm sm:text-base text-[#5A6475] leading-relaxed">
                        {s.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-start gap-2 text-xs sm:text-sm font-medium text-[#0B1E38]">
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{s.tip}</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparent Pricing Guide */}
      <section className="py-16 bg-gradient-to-r from-[#F4F5F7] via-blue-50/40 to-amber-50/30 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#EA580C]">
              Clear Pricing
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-[#0B1E38] tracking-tight text-balance">
              How Pricing Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingGuides.map((g) => (
              <div key={g.title} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className={`h-1.5 ${g.barClass}`} />
                <div className="p-6 space-y-3 flex-1">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${g.badgeClass}`}>
                    {g.title}
                  </span>
                  <p className="text-sm text-[#5A6475] leading-relaxed">{g.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Strip */}
      <section className="py-16 bg-gradient-to-r from-[#071426] via-[#0F2A4D] to-[#0F766E] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-balance">
              Ready to Book Your Next Home Fix?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/80">
              Add your jobs to the cart, submit our booking form, or message us directly on WhatsApp.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/book"
              className="group btn-animated btn-grad-warm inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0"
            >
              <span>Start Booking Now</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-animated btn-grad-emerald inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
            <a
              href={telHref}
              className="btn-animated btn-grad-glass inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold font-mono-num whitespace-nowrap shrink-0"
            >
              <Phone className="w-4 h-4 text-[#38BDF8]" aria-hidden="true" />
              <span>{settings.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
