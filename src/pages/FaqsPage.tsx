import React, { useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { FAQ_ITEMS } from '../data/business';

export const FaqsPage: React.FC = () => {
  useDocumentMeta(
    'Frequently Asked Questions | KAAM FIX Rawalpindi',
    'Answers to common questions about booking multiple home services, quotations, areas covered, and pricing at KAAM FIX.'
  );

  const { settings } = useStore();
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-gradient-to-b from-indigo-50/35 via-[#F4F5F7] to-teal-50/30 min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
            Help &amp; Information
          </p>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#5A6475]">
            Common questions about booking jobs, pricing, areas we cover, and changing
            appointments.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[#F4F5F7]/60 transition-colors cursor-pointer"
                >
                  <span className="font-display text-base font-bold text-[#0B1E38]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#1D6FF2] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    id={`faq-panel-${item.id}`}
                    className="px-6 pb-5 text-sm sm:text-base text-[#5A6475] leading-relaxed"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#071426] via-[#0B1E38] to-[#0F4C5C] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg">
          <div>
            <h2 className="font-display text-xl font-bold">Still have a question?</h2>
            <p className="mt-1 text-sm text-white/80">
              Call us at {settings.phoneDisplay} or reach out on WhatsApp during business hours (
              {settings.hours}).
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
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
              to="/contact"
              className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
