import React, { useState } from 'react';
import { ArrowRight, Eye, X } from 'lucide-react';
import { ParallaxBanner } from '../components/ParallaxSection';
import { SafeImage } from '../components/SafeImage';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import type { ProjectPortfolioItem } from '../types/kaamfix';

const CATEGORIES: ('All' | ProjectPortfolioItem['category'])[] = [
  'All',
  'Electrical Work',
  'Plumbing Work',
  'Carpentry',
  'Painting',
  'Civil Work',
  'Renovation',
  'Construction',
];

export const OurWorkPage: React.FC = () => {
  useDocumentMeta(
    'Our Work & Gallery | KAAM FIX Rawalpindi',
    'See examples of electrical, plumbing, carpentry, painting, tile work, and home renovations.'
  );

  const { projects } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectPortfolioItem['category']>('All');
  const [lightboxItem, setLightboxItem] = useState<ProjectPortfolioItem | null>(null);
  const [viewMode, setViewMode] = useState<Record<string, 'after' | 'before'>>({});

  const visibleProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-16 md:pt-[72px]">
      <ParallaxBanner
        imageKey="service_carpentry"
        alt="Carpenter fitting wooden home cabinets"
        eyebrow="Our Work"
        eyebrowClass="text-[#FBBF24]"
        overlayGradient="bg-gradient-to-r from-[#271306]/94 via-[#0B1E38]/82 to-[#D97706]/50"
        title="Examples of What We Do"
        description="See sample jobs and finished work across electrical, plumbing, carpentry, painting, tile work, and home renovations."
        heightClass="min-h-[340px]"
      />

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="mb-8 p-4 rounded-xl bg-[#F4F5F7] border border-slate-200 text-xs sm:text-sm text-[#5A6475]">
            Note: Entries labeled <strong className="text-[#0B1E38]">Example Work</strong> show the type of jobs we handle across each trade. Real customer project photos are added as jobs are completed.
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F5F7] p-1.5 rounded-xl mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn-animated px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'btn-grad-warm shadow-xs'
                    : 'text-[#5A6475] hover:text-[#0B1E38] hover:bg-white/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {visibleProjects.length === 0 ? (
            <div className="py-16 text-center bg-[#F4F5F7] rounded-xl border border-slate-200">
              <p className="text-base font-semibold text-[#0B1E38]">
                No projects listed under {selectedCategory} yet.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="btn-animated btn-grad-primary mt-4 px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer"
              >
                View All Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {visibleProjects.map((project) => {
                const mode = viewMode[project.id] || 'after';
                return (
                  <article
                    key={project.id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-[4/3] bg-[#F4F5F7]">
                      <SafeImage
                        imageKey={project.imageKey}
                        customUrl={project.customImageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs font-medium text-[#5A6475]">
                        {project.category} · {project.locationLabel}
                      </p>
                      <h2 className="mt-1 font-display text-lg font-bold text-[#0B1E38]">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm text-[#5A6475] leading-relaxed">
                        {project.description}
                      </p>

                      {/* Before / After Comparison Toggle */}
                      <div className="mt-4 p-3.5 rounded-lg bg-[#F4F5F7] border border-slate-200/80 text-xs space-y-2">
                        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-slate-200">
                          <button
                            type="button"
                            onClick={() => setViewMode((p) => ({ ...p, [project.id]: 'before' }))}
                            className={`flex-1 py-1 rounded text-xs font-semibold cursor-pointer ${
                              mode === 'before' ? 'bg-[#0B1E38] text-white' : 'text-[#5A6475]'
                            }`}
                          >
                            Before
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewMode((p) => ({ ...p, [project.id]: 'after' }))}
                            className={`flex-1 py-1 rounded text-xs font-semibold cursor-pointer ${
                              mode === 'after' ? 'bg-[#15803D] text-white' : 'text-[#5A6475]'
                            }`}
                          >
                            After
                          </button>
                        </div>
                        <p className="text-[#1E2430] leading-relaxed">
                          {mode === 'before' ? project.beforeSummary : project.afterSummary}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setLightboxItem(project)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D6FF2] hover:underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>View Details</span>
                        </button>
                        <Link
                          to="/book"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B1E38] hover:text-[#1D6FF2]"
                        >
                          <span>Book Similar Work</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/75 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="relative aspect-[16/10] bg-[#F4F5F7]">
              <SafeImage
                imageKey={lightboxItem.imageKey}
                customUrl={lightboxItem.customImageUrl}
                alt={lightboxItem.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Close project lightbox"
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white text-[#0B1E38] flex items-center justify-center shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-xs font-medium text-[#5A6475]">
                {lightboxItem.category} · {lightboxItem.locationLabel}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#0B1E38]">
                {lightboxItem.title}
              </h3>
              <p className="text-sm text-[#5A6475] leading-relaxed">{lightboxItem.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-lg bg-[#F4F5F7]">
                  <strong className="block text-[#0B1E38] mb-1">Before</strong>
                  <span className="text-[#5A6475]">{lightboxItem.beforeSummary}</span>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50">
                  <strong className="block text-[#15803D] mb-1">After</strong>
                  <span className="text-[#1E2430]">{lightboxItem.afterSummary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
