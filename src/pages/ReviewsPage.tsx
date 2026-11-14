import React from 'react';
import { ArrowRight, ExternalLink, MessageSquarePlus, Star } from 'lucide-react';
import { ParallaxBanner } from '../components/ParallaxSection';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import { BUSINESS_INFO } from '../data/business';

export const ReviewsPage: React.FC = () => {
  useDocumentMeta(
    'Customer Reviews | KAAM FIX Rawalpindi',
    'Verified customer review information for KAAM FIX home services in Rawalpindi.'
  );

  const { reviews, settings } = useStore();
  const googleReviewsSearchUrl =
    'https://www.google.com/maps/search/?api=1&query=KAAM+FIX+Al+Shafi+St+Satellite+Block+D+Town+Rawalpindi';

  return (
    <div className="pt-16 md:pt-[72px]">
      <ParallaxBanner
        imageKey="service_painting"
        alt="Freshly painted room wall"
        eyebrow="Customer Feedback"
        eyebrowClass="text-[#F472B6]"
        overlayGradient="bg-gradient-to-r from-[#1E1035]/94 via-[#3B1742]/82 to-[#BE185D]/50"
        title="Customer Reviews"
        description={`KAAM FIX currently has ${BUSINESS_INFO.googleReviewsCount} reviews listed on Google. We never invent fake reviews or star ratings.`}
        heightClass="min-h-[340px]"
      />

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
          {/* Verified Google Listing Card */}
          <div className="p-8 rounded-2xl bg-[#F4F5F7] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D6FF2]">
                <Star className="w-4 h-4 fill-[#1D6FF2]" aria-hidden="true" />
                <span>Google Business Profile</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1E38]">
                {BUSINESS_INFO.googleReviewsCount} Google Reviews Listed
              </h2>
              <p className="text-sm sm:text-base text-[#5A6475] leading-relaxed">
                Read what customers say directly on Google Maps or share your own feedback after a
                KAAM FIX visit in Rawalpindi.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href={googleReviewsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-animated btn-grad-dark inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                <span>View on Google</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={googleReviewsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-animated btn-grad-primary inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                <MessageSquarePlus className="w-4 h-4" aria-hidden="true" />
                <span>Leave a Review</span>
              </a>
            </div>
          </div>

          {/* Verified Reviews Added via Admin */}
          {reviews.length === 0 ? (
            <div className="p-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-rose-50/30 to-indigo-50/30 text-center space-y-3">
              <h3 className="font-display text-xl font-bold text-[#0B1E38]">
                Real Customer Feedback
              </h3>
              <p className="text-sm text-[#5A6475] max-w-lg mx-auto leading-relaxed">
                We only post verified reviews from actual jobs on this website. In the meantime, you
                can read all {BUSINESS_INFO.googleReviewsCount} of our reviews directly on Google or
                check our Facebook page.
              </p>
              <div className="pt-3 flex flex-wrap justify-center gap-3">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-[#0B1E38] hover:bg-[#F4F5F7] whitespace-nowrap"
                >
                  <span>Visit Official Facebook Page</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1 text-[#F59E0B]" aria-label={`${rev.rating} out of 5 stars`}>
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <span className="text-xs text-[#5A6475]">
                        {rev.source} · {rev.dateLabel}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-[#1E2430] leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs">
                    <p className="font-semibold text-[#0B1E38]">{rev.reviewerName}</p>
                    <p className="text-[#5A6475]">{rev.serviceType}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
