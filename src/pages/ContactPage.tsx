import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  useDocumentMeta(
    'Contact KAAM FIX | Rawalpindi Home Services',
    'Contact KAAM FIX at Al Shafi St, Satellite Block D Town, Rawalpindi. Call 0301 6800786 or send an inquiry online.'
  );

  const { categories, settings } = useStore();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    serviceCategory: 'General Inquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const telHref = `tel:+92${settings.phoneDisplay.replace(/\D/g, '').replace(/^0/, '')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      setError('Please enter your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not send inquiry. Please call or WhatsApp us.');
        return;
      }
      setSubmitted(true);
      setForm({
        name: '',
        phone: '',
        address: '',
        serviceCategory: 'General Inquiry',
        message: '',
      });
    } catch {
      setError('Network error submitting inquiry. Please call 0301 6800786 directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-gradient-to-b from-sky-50/40 via-[#F4F5F7] to-amber-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
            Get in Touch
          </p>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight">
            Contact KAAM FIX
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#5A6475]">
            Reach our Rawalpindi team by phone, WhatsApp, or the inquiry form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details + Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-sm font-bold text-[#0B1E38]">Address</h2>
                  <p className="text-sm text-[#5A6475] mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-sm font-bold text-[#0B1E38]">Phone</h2>
                  <a
                    href={telHref}
                    className="font-mono-num text-sm font-semibold text-[#1D6FF2] hover:underline mt-0.5 inline-block"
                  >
                    {settings.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#1D6FF2] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="font-display text-sm font-bold text-[#0B1E38]">Business Hours</h2>
                  <p className="text-sm text-[#5A6475] mt-0.5">{settings.hours}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2.5">
                <a
                  href={telHref}
                  className="btn-animated btn-grad-dark inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Call Now</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated btn-grad-emerald inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-[#0B1E38] text-xs font-semibold whitespace-nowrap"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white h-72">
              <iframe
                title="KAAM FIX Rawalpindi Map"
                src="https://www.google.com/maps?q=Al+Shafi+St,+Satellite+Block+D+Town,+Rawalpindi,+46300,+Pakistan&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                  Send a Service Inquiry
                </h2>
                <p className="text-sm text-[#5A6475] mt-1">
                  Want to book several jobs at once? Add them to your cart and send one request.
                </p>
              </div>
              <Link
                to="/book"
                className="group btn-animated btn-grad-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap"
              >
                <span>Go to Booking Form</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2.5 text-[#15803D]">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  <h3 className="font-display text-lg font-bold text-[#0B1E38]">
                    Inquiry Submitted
                  </h3>
                </div>
                <p className="text-sm text-[#1E2430]">
                  Thank you for contacting KAAM FIX. Our team has received your message and will
                  reply during working hours ({settings.hours}).
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-[#0B1E38] text-white text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-name" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                      Customer Name *
                    </label>
                    <input
                      id="cf-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                    />
                  </div>
                  <div>
                    <label htmlFor="cf-phone" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="cf-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="0301 6800786"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm font-mono-num focus:outline-2 focus:outline-[#1D6FF2]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cf-service" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                      Service Inquiry
                    </label>
                    <select
                      id="cf-service"
                      value={form.serviceCategory}
                      onChange={(e) => setForm({ ...form, serviceCategory: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-2 focus:outline-[#1D6FF2]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      {categories.map((cat) => (
                        <option key={cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cf-address" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                      Address / Area in Rawalpindi
                    </label>
                    <input
                      id="cf-address"
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Sector / Street"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cf-message" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="cf-message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your repair, installation, or renovation inquiry..."
                    className="w-full p-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-lg disabled:opacity-50 text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
