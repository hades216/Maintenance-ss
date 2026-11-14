import type { ServiceCategorySlug } from '../types/kaamfix';

export interface CategoryVisualTheme {
  accentBar: string;
  badgeGradient: string;
  buttonGradient: string;
  bannerOverlay: string;
  softSurface: string;
  eyebrowColor: string;
  textAccent: string;
  borderHover: string;
}

export const CATEGORY_THEMES: Record<ServiceCategorySlug, CategoryVisualTheme> = {
  electrical: {
    accentBar: 'bg-gradient-to-r from-[#1D6FF2] via-[#0EA5E9] to-[#06B6D4]',
    badgeGradient: 'bg-gradient-to-br from-[#1D6FF2] to-[#06B6D4] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#1D6FF2] via-[#0284C7] to-[#0891B2] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#071426]/95 via-[#0B2A52]/82 to-[#0E7490]/55',
    softSurface: 'bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-cyan-50/80',
    eyebrowColor: 'text-[#38BDF8]',
    textAccent: 'text-[#0284C7]',
    borderHover: 'hover:border-sky-300',
  },
  plumbing: {
    accentBar: 'bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#10B981]',
    badgeGradient: 'bg-gradient-to-br from-[#0F766E] to-[#10B981] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#059669] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#042F2E]/95 via-[#0F4C5C]/82 to-[#059669]/55',
    softSurface: 'bg-gradient-to-br from-teal-50/90 via-emerald-50/70 to-cyan-50/80',
    eyebrowColor: 'text-[#34D399]',
    textAccent: 'text-[#0D9488]',
    borderHover: 'hover:border-teal-300',
  },
  carpentry: {
    accentBar: 'bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#DC2626]',
    badgeGradient: 'bg-gradient-to-br from-[#D97706] to-[#EA580C] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#C2410C] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#271306]/95 via-[#431C08]/82 to-[#9A3412]/55',
    softSurface: 'bg-gradient-to-br from-amber-50/90 via-orange-50/70 to-yellow-50/70',
    eyebrowColor: 'text-[#FBBF24]',
    textAccent: 'text-[#D97706]',
    borderHover: 'hover:border-amber-300',
  },
  painting: {
    accentBar: 'bg-gradient-to-r from-[#E11D48] via-[#DB2777] to-[#6366F1]',
    badgeGradient: 'bg-gradient-to-br from-[#E11D48] to-[#7C3AED] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#E11D48] via-[#DB2777] to-[#4F46E5] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#1E1035]/95 via-[#4C1D4F]/80 to-[#BE185D]/50',
    softSurface: 'bg-gradient-to-br from-rose-50/90 via-fuchsia-50/60 to-indigo-50/80',
    eyebrowColor: 'text-[#F472B6]',
    textAccent: 'text-[#DB2777]',
    borderHover: 'hover:border-rose-300',
  },
  'civil-work': {
    accentBar: 'bg-gradient-to-r from-[#334155] via-[#B45309] to-[#EA580C]',
    badgeGradient: 'bg-gradient-to-br from-[#334155] to-[#D97706] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#1E293B] via-[#92400E] to-[#D97706] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#0F172A]/95 via-[#292524]/82 to-[#92400E]/55',
    softSurface: 'bg-gradient-to-br from-slate-100/90 via-amber-50/70 to-stone-100/80',
    eyebrowColor: 'text-[#F59E0B]',
    textAccent: 'text-[#B45309]',
    borderHover: 'hover:border-amber-300',
  },
  'home-maintenance': {
    accentBar: 'bg-gradient-to-r from-[#4338CA] via-[#1D6FF2] to-[#059669]',
    badgeGradient: 'bg-gradient-to-br from-[#4338CA] to-[#059669] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#4338CA] via-[#1D6FF2] to-[#0D9488] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#0B1437]/95 via-[#1E2B6B]/82 to-[#047857]/55',
    softSurface: 'bg-gradient-to-br from-indigo-50/90 via-blue-50/70 to-emerald-50/70',
    eyebrowColor: 'text-[#818CF8]',
    textAccent: 'text-[#4338CA]',
    borderHover: 'hover:border-indigo-300',
  },
  renovation: {
    accentBar: 'bg-gradient-to-r from-[#0B1E38] via-[#1D6FF2] to-[#F59E0B]',
    badgeGradient: 'bg-gradient-to-br from-[#0B1E38] via-[#1D6FF2] to-[#D97706] text-white',
    buttonGradient: 'bg-gradient-to-r from-[#0B1E38] via-[#1D6FF2] to-[#D97706] text-white',
    bannerOverlay: 'bg-gradient-to-r from-[#071426]/95 via-[#162C5B]/82 to-[#B45309]/55',
    softSurface: 'bg-gradient-to-br from-slate-100/90 via-blue-50/80 to-amber-50/80',
    eyebrowColor: 'text-[#FBBF24]',
    textAccent: 'text-[#1D6FF2]',
    borderHover: 'hover:border-blue-300',
  },
};

export function getCategoryTheme(slug?: ServiceCategorySlug | string): CategoryVisualTheme {
  if (slug && slug in CATEGORY_THEMES) {
    return CATEGORY_THEMES[slug as ServiceCategorySlug];
  }
  return CATEGORY_THEMES.electrical;
}
