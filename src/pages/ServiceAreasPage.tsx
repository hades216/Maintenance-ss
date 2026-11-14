import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ParallaxBanner } from '../components/ParallaxSection';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';

export const ServiceAreasPage: React.FC = () => {
  useDocumentMeta(
    'Service Areas | KAAM FIX Rawalpindi',
    'KAAM FIX operates from Al Shafi St, Satellite Block D Town, Rawalpindi, 46300, serving Rawalpindi and nearby areas subject to confirmation.'
  );

  const { settings } = useStore();
  const [areaInput, setAreaInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!areaInput.trim()) return;
    const normalized = areaInput.trim().toLowerCase();
    const isConfirmed = settings.confirmedAreas.some((a) =>
      a.toLowerCase().includes(normalized) || normalized.includes('satellite')
    );

    if (isConfirmed) {
      setCheckResult(
        `Yes — ${areaInput.trim()} is near our Satellite Block D Town hub in Rawalpindi. You can proceed with online booking or call ${settings.phoneDisplay}.`
      );
      return;
    }

    if (phoneInput.trim()) {
      setSubmitting(true);
      try {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Area Availability Check',
            phone: phoneInput.trim(),
            address: areaInput.trim(),
            serviceCategory: 'Service Area Availability',
            message: `Customer requested availability confirmation for area: ${areaInput.trim()}`,
          }),
        });
      } catch {
        // Still display direct phone/WhatsApp confirmation prompt
      } finally {
        setSubmitting(false);
      }
    }

    setCheckResult(
      `Availability in "${areaInput.trim()}" is subject to confirmation by our dispatch team. Call ${settings.phoneDisplay} or message us on WhatsApp to confirm coverage for your street.`
    );
  };

  return (
    <div className="pt-16 md:pt-[72px]">
      <ParallaxBanner
        imageKey="hero_electrician"
        alt="KAAM FIX technician working in Rawalpindi"
        eyebrow="Where We Work"
        eyebrowClass="text-[#34D399]"
        overlayGradient="bg-gradient-to-r from-[#042F2E]/95 via-[#0B2B3C]/82 to-[#059669]/55"
        title="Service Areas in Rawalpindi"
        description="Based at Al Shafi St, Satellite Block D Town, Rawalpindi (46300). Serving Rawalpindi and nearby areas, confirmed on call."
        heightClass="min-h-[340px]"
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Location Info & Availability Checker */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
                  Primary Location
                </p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#0B1E38]">
                  Rawalpindi, Pakistan
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#5A6475] leading-relaxed">
                  {settings.serviceLocationNote}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#F4F5F7] border border-slate-200 space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-[#0B1E38] block">Office Address</span>
                    <span className="text-[#5A6475]">{settings.address}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-semibold text-[#0B1E38] block">Direct Phone</span>
                    <span className="font-mono-num text-[#5A6475]">{settings.phoneDisplay}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#5A6475] mb-3">
                  Confirmed Coverage
                </h3>
                <ul className="space-y-2">
                  {settings.confirmedAreas.map((area) => (
                    <li
                      key={area}
                      className="flex items-center gap-2 text-sm font-medium text-[#0B1E38]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" aria-hidden="true" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Check Service Availability Form */}
              <form
                onSubmit={handleCheckAvailability}
                className="p-6 rounded-xl bg-gradient-to-br from-[#071426] via-[#0B1E38] to-[#0F4C5C] text-white space-y-4 shadow-md"
              >
                <h3 className="font-display text-lg font-bold">
                  Check Service Availability in Your Area
                </h3>
                <div>
                  <label htmlFor="sa-area" className="block text-xs text-white/80 mb-1">
                    Your Sector / Colony / Housing Society *
                  </label>
                  <input
                    id="sa-area"
                    type="text"
                    required
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    placeholder="e.g., Satellite Town Block D, Chaklala Scheme III"
                    className="w-full h-10 px-3 rounded-lg bg-white text-[#1E2430] text-sm focus:outline-2 focus:outline-[#60A5FA]"
                  />
                </div>
                <div>
                  <label htmlFor="sa-phone" className="block text-xs text-white/80 mb-1">
                    Mobile Number (Optional — for callback confirmation)
                  </label>
                  <input
                    id="sa-phone"
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="0301 6800786"
                    className="w-full h-10 px-3 rounded-lg bg-white text-[#1E2430] text-sm font-mono-num focus:outline-2 focus:outline-[#60A5FA]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-animated btn-grad-primary w-full py-2.5 px-4 rounded-lg text-sm font-semibold cursor-pointer"
                >
                  {submitting ? 'Checking...' : 'Check Service Availability in Your Area'}
                </button>

                {checkResult && (
                  <div className="p-3.5 rounded-lg bg-white/10 border border-white/15 text-xs sm:text-sm text-white leading-relaxed">
                    {checkResult}
                  </div>
                )}
              </form>
            </div>

            {/* Verified Business Location Map */}
            <div className="lg:col-span-7 space-y-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#F4F5F7] h-[420px] md:h-[500px]">
                <iframe
                  title="KAAM FIX Location — Al Shafi St, Satellite Block D Town, Rawalpindi"
                  src="https://www.google.com/maps?q=Al+Shafi+St,+Satellite+Block+D+Town,+Rawalpindi,+46300,+Pakistan&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-[#F4F5F7] border border-slate-200">
                <p className="text-sm text-[#5A6475]">
                  Need a technician at your home in Rawalpindi?
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/${settings.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-animated btn-grad-emerald inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>WhatsApp</span>
                  </a>
                  <Link
                    to="/book"
                    className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
                  >
                    <span>Book a Service</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
