import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Image as ImageIcon,
  Lock,
  LogOut,
  Plus,
  Settings,
  Trash2,
  Wrench,
} from 'lucide-react';
import { useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import type {
  AdminAnalytics,
  BookingRecord,
  BookingStatus,
  ContactInquiry,
  EditableBusinessSettings,
  ImageKey,
  PricingType,
  ProjectPortfolioItem,
  ServiceCategory,
  ServiceCategorySlug,
  ServiceItem,
  VerifiedReview,
} from '../types/kaamfix';
import { BOOKING_STATUSES, formatPkr, formatServicePrice } from '../utils/bookingLogic';

type AdminTab = 'overview' | 'bookings' | 'catalog' | 'gallery-reviews' | 'settings';

const IMAGE_KEYS: ImageKey[] = [
  'service_electrical',
  'service_plumbing',
  'service_carpentry',
  'service_painting',
  'service_civil_work',
  'service_maintenance',
  'service_renovation',
  'hero_electrician',
  'hero_plumber',
  'hero_renovation',
  'intro_home_solution',
];

interface DashboardData {
  bookings: BookingRecord[];
  inquiries: ContactInquiry[];
  categories: ServiceCategory[];
  services: ServiceItem[];
  projects: ProjectPortfolioItem[];
  reviews: VerifiedReview[];
  settings: EditableBusinessSettings;
  analytics: AdminAnalytics;
}

export const AdminPage: React.FC = () => {
  useDocumentMeta(
    'Admin Portal | KAAM FIX',
    'Secure business management console for KAAM FIX bookings, pricing, service catalog, and analytics.'
  );

  const { refreshBootstrap } = useStore();
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<AdminTab>('overview');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'All' | BookingStatus>('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // Booking edit draft
  const [bookingStatusDraft, setBookingStatusDraft] = useState<BookingStatus>('New Request');
  const [bookingPriceDraft, setBookingPriceDraft] = useState('');
  const [bookingNotesDraft, setBookingNotesDraft] = useState('');

  // New Service form
  const [newService, setNewService] = useState({
    categorySlug: 'electrical' as ServiceCategorySlug,
    name: '',
    shortDescription: '',
    unitLabel: 'per job',
    pricingType: 'quote' as PricingType,
    pricePkr: '',
    imageKey: 'service_electrical' as ImageKey,
    customImageUrl: '',
  });

  // New Project form
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Renovation' as ProjectPortfolioItem['category'],
    locationLabel: 'Rawalpindi',
    description: '',
    beforeSummary: '',
    afterSummary: '',
    imageKey: 'service_renovation' as ImageKey,
    customImageUrl: '',
    isIllustrativeSample: false,
  });

  // New Verified Review form
  const [newReview, setNewReview] = useState({
    reviewerName: '',
    rating: 5,
    comment: '',
    serviceType: 'Home Maintenance',
    source: 'Google' as 'Google' | 'Direct',
  });

  // Editable Business Settings draft
  const [settingsDraft, setSettingsDraft] = useState<EditableBusinessSettings | null>(null);
  const [areasText, setAreasText] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (res.ok) {
        const json = (await res.json()) as DashboardData;
        setData(json);
        setSettingsDraft(json.settings);
        setAreasText(json.settings.confirmedAreas.join('\n'));
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((res: { authenticated?: boolean }) => {
        const isAuthed = Boolean(res.authenticated);
        setAuthenticated(isAuthed);
        setAuthChecked(true);
        if (isAuthed) {
          loadDashboard();
        }
      })
      .catch(() => setAuthChecked(true));
  }, [loadDashboard]);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    window.setTimeout(() => setStatusMessage(''), 3200);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setLoginError(json.error || 'Authentication failed.');
        return;
      }
      setAuthenticated(true);
      setPassword('');
      await loadDashboard();
    } catch {
      setLoginError('Unable to reach server.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setData(null);
  };

  const openBookingEditor = (booking: BookingRecord) => {
    setSelectedBooking(booking);
    setBookingStatusDraft(booking.status);
    setBookingPriceDraft(
      booking.quotedTotalPkr !== null ? String(booking.quotedTotalPkr) : ''
    );
    setBookingNotesDraft(booking.adminNotes || '');
  };

  const handleSaveBookingUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const parsedPrice = bookingPriceDraft.trim() ? Number(bookingPriceDraft) : null;
    const res = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: bookingStatusDraft,
        quotedTotalPkr: Number.isFinite(parsedPrice) ? parsedPrice : null,
        adminNotes: bookingNotesDraft,
      }),
    });
    if (res.ok) {
      await loadDashboard();
      setSelectedBooking(null);
      notify('Booking updated and revenue analytics recalculated.');
    }
  };

  const handleServicePatch = async (
    serviceId: string,
    updates: Partial<ServiceItem>
  ) => {
    const res = await fetch(`/api/admin/services/${serviceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await loadDashboard();
      await refreshBootstrap();
      notify('Service catalog updated.');
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name.trim() || !newService.shortDescription.trim()) return;
    const priceVal = newService.pricePkr.trim() ? Number(newService.pricePkr) : null;
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categorySlug: newService.categorySlug,
        name: newService.name,
        shortDescription: newService.shortDescription,
        detailedDescription: newService.shortDescription,
        unitLabel: newService.unitLabel || 'per job',
        pricingType: newService.pricingType,
        pricePkr: newService.pricingType === 'quote' ? null : priceVal,
        imageKey: newService.imageKey,
        customImageUrl: newService.customImageUrl || undefined,
      }),
    });
    if (res.ok) {
      setNewService({
        categorySlug: 'electrical',
        name: '',
        shortDescription: '',
        unitLabel: 'per job',
        pricingType: 'quote',
        pricePkr: '',
        imageKey: 'service_electrical',
        customImageUrl: '',
      });
      await loadDashboard();
      await refreshBootstrap();
      notify('New service added to catalog.');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    const res = await fetch(`/api/admin/services/${serviceId}`, { method: 'DELETE' });
    if (res.ok) {
      await loadDashboard();
      await refreshBootstrap();
      notify('Service removed from catalog.');
    }
  };

  const handleCategoryUpdate = async (
    slug: ServiceCategorySlug,
    updates: { tagline: string; description: string }
  ) => {
    const res = await fetch(`/api/admin/categories/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await loadDashboard();
      await refreshBootstrap();
      notify('Category details updated.');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) return;
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
    if (res.ok) {
      setNewProject({
        title: '',
        category: 'Renovation',
        locationLabel: 'Rawalpindi',
        description: '',
        beforeSummary: '',
        afterSummary: '',
        imageKey: 'service_renovation',
        customImageUrl: '',
        isIllustrativeSample: false,
      });
      await loadDashboard();
      await refreshBootstrap();
      notify('Project added to Our Work gallery.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadDashboard();
      await refreshBootstrap();
      notify('Project deleted.');
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.reviewerName.trim() || !newReview.comment.trim()) return;
    const res = await fetch('/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReview),
    });
    if (res.ok) {
      setNewReview({
        reviewerName: '',
        rating: 5,
        comment: '',
        serviceType: 'Home Maintenance',
        source: 'Google',
      });
      await loadDashboard();
      await refreshBootstrap();
      notify('Verified customer review added.');
    }
  };

  const handleDeleteReview = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadDashboard();
      await refreshBootstrap();
      notify('Review removed.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsDraft) return;
    const confirmedAreas = areasText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settingsDraft, confirmedAreas }),
    });
    if (res.ok) {
      await loadDashboard();
      await refreshBootstrap();
      notify('Business contact & booking availability settings saved.');
    }
  };

  if (!authChecked) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <p className="text-sm text-[#5A6475]">Checking admin session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-[#F4F5F7] flex items-center justify-center px-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0B1E38] text-white flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#60A5FA]" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-[#0B1E38]">
                KAAM FIX Admin Portal
              </h1>
              <p className="text-xs text-[#5A6475]">
                Authorized personnel only
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {loginError}
              </div>
            )}
            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter KAAMFIX_ADMIN_PASSWORD"
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-lg bg-[#0B1E38] hover:bg-[#132F56] text-white text-sm font-semibold cursor-pointer"
            >
              {loggingIn ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-xs text-[#5A6475] leading-relaxed border-t border-slate-100 pt-4">
            Configure <code className="font-mono-num text-[#0B1E38]">KAAMFIX_ADMIN_PASSWORD</code>{' '}
            and <code className="font-mono-num text-[#0B1E38]">KAAMFIX_SESSION_SECRET</code> in your
            server or Netlify environment variables before production deployment.
          </p>
        </div>
      </div>
    );
  }

  const visibleBookings =
    data?.bookings.filter((b) => bookingFilter === 'All' || b.status === bookingFilter) ?? [];

  return (
    <div className="pt-20 md:pt-24 pb-20 bg-[#F4F5F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-6">
        {/* Top Admin Header Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#1D6FF2]">KAAM FIX Operations</p>
            <h1 className="font-display text-2xl font-bold text-[#0B1E38]">
              Business Management Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {statusMessage && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{statusMessage}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-[#0B1E38] hover:bg-[#F4F5F7] cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200">
          {[
            { id: 'overview', label: 'Overview & Revenue', icon: BarChart3 },
            { id: 'bookings', label: `Booking Requests (${data?.bookings.length ?? 0})`, icon: CalendarCheck },
            { id: 'catalog', label: 'Services & Pricing', icon: Wrench },
            { id: 'gallery-reviews', label: 'Gallery & Reviews', icon: ImageIcon },
            { id: 'settings', label: 'Settings & Inquiries', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as AdminTab)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#0B1E38] text-white'
                    : 'text-[#5A6475] hover:text-[#0B1E38] hover:bg-[#F4F5F7]'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {loadingData && !data ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-sm text-[#5A6475]">
            Loading KAAM FIX operations data...
          </div>
        ) : (
          data && (
            <>
              {/* TAB 1: OVERVIEW & REVENUE TRENDS */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-[#5A6475]">Total Booking Requests</p>
                      <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#0B1E38]">
                        {data.analytics.totalBookings}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-[#5A6475]">New / Pending Action</p>
                      <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#1D6FF2]">
                        {data.analytics.newRequests}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-[#5A6475]">Completed Jobs</p>
                      <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#15803D]">
                        {data.analytics.completedBookings}
                      </p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200">
                      <p className="text-xs font-medium text-[#5A6475]">Confirmed Revenue</p>
                      <p className="mt-1.5 font-mono-num text-2xl font-bold text-[#0B1E38]">
                        {formatPkr(data.analytics.totalConfirmedRevenuePkr)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Monthly Trends */}
                    <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200">
                      <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                        Monthly Revenue &amp; Booking Trends
                      </h2>
                      <p className="text-xs text-[#5A6475] mt-1 mb-5">
                        Calculated live from persisted booking quotations and completed jobs.
                      </p>

                      {data.analytics.monthlyTrends.length === 0 ? (
                        <p className="text-sm text-[#5A6475] py-8 text-center bg-[#F4F5F7] rounded-lg">
                          No bookings submitted yet. Trends populate automatically as requests arrive.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {data.analytics.monthlyTrends.map((m) => {
                            const maxRev = Math.max(
                              ...data.analytics.monthlyTrends.map((x) => x.revenuePkr),
                              1
                            );
                            const widthPct = Math.max(8, Math.round((m.revenuePkr / maxRev) * 100));
                            return (
                              <div key={m.month} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="font-semibold text-[#0B1E38]">{m.month}</span>
                                  <span className="font-mono-num text-[#5A6475]">
                                    {m.bookings} bookings · {formatPkr(m.revenuePkr)}
                                  </span>
                                </div>
                                <div className="h-2.5 bg-[#F4F5F7] rounded-full overflow-hidden">
                                  <div
                                    style={{ width: `${widthPct}%` }}
                                    className="h-full bg-[#1D6FF2] rounded-full"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Category Demand Breakdown */}
                    <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200">
                      <h2 className="font-display text-lg font-bold text-[#0B1E38] mb-4">
                        Service Demand by Category
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 text-left text-xs text-[#5A6475]">
                              <th className="py-2 font-semibold">Category</th>
                              <th className="py-2 font-semibold text-right">Units Booked</th>
                              <th className="py-2 font-semibold text-right">Revenue</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {data.analytics.categoryCounts.map((row) => (
                              <tr key={row.categoryName}>
                                <td className="py-2.5 font-medium text-[#0B1E38]">
                                  {row.categoryName}
                                </td>
                                <td className="py-2.5 text-right font-mono-num text-[#1E2430]">
                                  {row.count}
                                </td>
                                <td className="py-2.5 text-right font-mono-num text-[#0B1E38]">
                                  {formatPkr(row.revenuePkr)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKING REQUESTS */}
              {tab === 'bookings' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200">
                    {(['All', ...BOOKING_STATUSES] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setBookingFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          bookingFilter === st
                            ? 'bg-[#0B1E38] text-white'
                            : 'text-[#5A6475] hover:bg-[#F4F5F7]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {visibleBookings.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-sm text-[#5A6475]">
                      No booking requests match the current filter.
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#F4F5F7] border-b border-slate-200 text-left text-xs text-[#5A6475]">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Reference</th>
                              <th className="px-4 py-3 font-semibold">Customer</th>
                              <th className="px-4 py-3 font-semibold">Services</th>
                              <th className="px-4 py-3 font-semibold">Appointment</th>
                              <th className="px-4 py-3 font-semibold">Status</th>
                              <th className="px-4 py-3 font-semibold text-right">Confirmed Quote</th>
                              <th className="px-4 py-3 font-semibold text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {visibleBookings.map((bk) => (
                              <tr key={bk.id} className="hover:bg-[#F4F5F7]/50">
                                <td className="px-4 py-3.5 font-mono-num font-semibold text-[#0B1E38]">
                                  {bk.referenceCode}
                                </td>
                                <td className="px-4 py-3.5">
                                  <div className="font-semibold text-[#0B1E38]">
                                    {bk.customer.fullName}
                                  </div>
                                  <div className="text-xs font-mono-num text-[#5A6475]">
                                    {bk.customer.mobileNumber}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-[#1E2430]">
                                  {bk.items.map((i) => `${i.serviceName} × ${i.quantity}`).join(', ')}
                                </td>
                                <td className="px-4 py-3.5 text-xs font-mono-num text-[#5A6475]">
                                  {bk.appointment.preferredDate}
                                  <div className="text-[11px]">{bk.appointment.preferredTime}</div>
                                </td>
                                <td className="px-4 py-3.5 text-xs font-semibold text-[#1D6FF2]">
                                  {bk.status}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono-num font-semibold text-[#0B1E38]">
                                  {bk.quotedTotalPkr !== null ? formatPkr(bk.quotedTotalPkr) : 'Quote Pending'}
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => openBookingEditor(bk)}
                                    className="px-3 py-1.5 rounded-lg bg-[#0B1E38] text-white text-xs font-semibold cursor-pointer"
                                  >
                                    Manage
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Booking Detail & Update Modal */}
                  {selectedBooking && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071426]/65"
                      role="dialog"
                      aria-modal="true"
                      aria-label={`Manage booking ${selectedBooking.referenceCode}`}
                    >
                      <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                          <div>
                            <p className="text-xs font-mono-num text-[#1D6FF2] font-semibold">
                              {selectedBooking.referenceCode}
                            </p>
                            <h3 className="font-display text-xl font-bold text-[#0B1E38]">
                              {selectedBooking.customer.fullName}
                            </h3>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(null)}
                            className="text-xs font-semibold text-[#5A6475] hover:text-[#0B1E38] cursor-pointer"
                          >
                            Close
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F4F5F7] p-4 rounded-xl">
                          <div>
                            <strong className="block text-[#0B1E38]">Contact &amp; Address</strong>
                            <p className="font-mono-num mt-1">{selectedBooking.customer.mobileNumber}</p>
                            <p className="text-[#5A6475]">
                              {selectedBooking.customer.streetAddress}, {selectedBooking.customer.areaSector},{' '}
                              {selectedBooking.customer.city}
                            </p>
                          </div>
                          <div>
                            <strong className="block text-[#0B1E38]">Job Description</strong>
                            <p className="text-[#5A6475] mt-1">
                              {selectedBooking.jobDetails.problemDescription}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#5A6475] mb-2">
                            Complete Service Cart
                          </h4>
                          <ul className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-sm">
                            {selectedBooking.items.map((item) => (
                              <li key={item.serviceId} className="px-4 py-2.5 flex justify-between">
                                <span>
                                  {item.serviceName} × {item.quantity}
                                  {item.notes ? ` (${item.notes})` : ''}
                                </span>
                                <span className="font-mono-num text-xs text-[#1D6FF2]">
                                  {formatServicePrice(item.pricingType, item.pricePkr)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <form onSubmit={handleSaveBookingUpdate} className="space-y-4 pt-2 border-t border-slate-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="adm-bk-status" className="block text-xs font-semibold text-[#0B1E38] mb-1">
                                Booking Status
                              </label>
                              <select
                                id="adm-bk-status"
                                value={bookingStatusDraft}
                                onChange={(e) => setBookingStatusDraft(e.target.value as BookingStatus)}
                                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                              >
                                {BOOKING_STATUSES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label htmlFor="adm-bk-quote" className="block text-xs font-semibold text-[#0B1E38] mb-1">
                                Confirmed Total (PKR)
                              </label>
                              <input
                                id="adm-bk-quote"
                                type="number"
                                min={0}
                                value={bookingPriceDraft}
                                onChange={(e) => setBookingPriceDraft(e.target.value)}
                                placeholder="Leave blank if pending quote"
                                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono-num"
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="adm-bk-notes" className="block text-xs font-semibold text-[#0B1E38] mb-1">
                              Internal Technician / Dispatch Notes
                            </label>
                            <textarea
                              id="adm-bk-notes"
                              rows={2}
                              value={bookingNotesDraft}
                              onChange={(e) => setBookingNotesDraft(e.target.value)}
                              className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(null)}
                              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 rounded-lg bg-[#1D6FF2] text-white text-xs font-semibold cursor-pointer"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SERVICE CATALOG & PRICING */}
              {tab === 'catalog' && (
                <div className="space-y-6">
                  {/* Add New Service */}
                  <form
                    onSubmit={handleCreateService}
                    className="bg-white rounded-xl border border-slate-200 p-6 space-y-4"
                  >
                    <h2 className="font-display text-lg font-bold text-[#0B1E38] flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#1D6FF2]" aria-hidden="true" />
                      <span>Add New Service</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <select
                        aria-label="New service category"
                        value={newService.categorySlug}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            categorySlug: e.target.value as ServiceCategorySlug,
                          })
                        }
                        className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        {data.categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        required
                        placeholder="Service name"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-slate-200 text-sm"
                      />

                      <select
                        aria-label="New service pricing type"
                        value={newService.pricingType}
                        onChange={(e) =>
                          setNewService({
                            ...newService,
                            pricingType: e.target.value as PricingType,
                          })
                        }
                        className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        <option value="quote">Quote Required / Price on Request</option>
                        <option value="fixed">Fixed Price (PKR)</option>
                        <option value="starting">Starting Price (PKR)</option>
                      </select>

                      <input
                        type="number"
                        min={0}
                        disabled={newService.pricingType === 'quote'}
                        placeholder="Price (PKR)"
                        value={newService.pricePkr}
                        onChange={(e) => setNewService({ ...newService, pricePkr: e.target.value })}
                        className="h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono-num disabled:bg-slate-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Short service description"
                        value={newService.shortDescription}
                        onChange={(e) =>
                          setNewService({ ...newService, shortDescription: e.target.value })
                        }
                        className="h-10 px-3 rounded-lg border border-slate-200 text-sm sm:col-span-2"
                      />
                      <select
                        aria-label="New service image preset"
                        value={newService.imageKey}
                        onChange={(e) =>
                          setNewService({ ...newService, imageKey: e.target.value as ImageKey })
                        }
                        className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                      >
                        {IMAGE_KEYS.map((k) => (
                          <option key={k} value={k}>
                            Image: {k}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#1D6FF2] hover:bg-[#1558C7] text-white text-xs font-semibold cursor-pointer"
                    >
                      Add Service to Catalog
                    </button>
                  </form>

                  {/* Editable Services Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200">
                      <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                        Manage Pricing, Availability &amp; Descriptions ({data.services.length})
                      </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {data.services.map((svc) => (
                        <ServiceAdminRow
                          key={svc.id}
                          service={svc}
                          onSave={(updates) => handleServicePatch(svc.id, updates)}
                          onDelete={() => handleDeleteService(svc.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Category Management */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                      Manage Service Categories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.categories.map((cat) => (
                        <CategoryAdminCard
                          key={cat.slug}
                          category={cat}
                          onSave={(u) => handleCategoryUpdate(cat.slug, u)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GALLERY & REVIEWS */}
              {tab === 'gallery-reviews' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gallery Projects Manager */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                      Manage Gallery Projects ({data.projects.length})
                    </h2>
                    <form onSubmit={handleCreateProject} className="space-y-3 pb-5 border-b border-slate-200">
                      <input
                        type="text"
                        required
                        placeholder="Project title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          aria-label="Project category"
                          value={newProject.category}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              category: e.target.value as ProjectPortfolioItem['category'],
                            })
                          }
                          className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                        >
                          {[
                            'Electrical Work',
                            'Plumbing Work',
                            'Carpentry',
                            'Painting',
                            'Civil Work',
                            'Renovation',
                            'Construction',
                          ].map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Location (e.g., Rawalpindi)"
                          value={newProject.locationLabel}
                          onChange={(e) =>
                            setNewProject({ ...newProject, locationLabel: e.target.value })
                          }
                          className="h-10 px-3 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="Project summary"
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject({ ...newProject, description: e.target.value })
                        }
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#0B1E38] text-white text-xs font-semibold cursor-pointer"
                      >
                        Add Project
                      </button>
                    </form>

                    <div className="space-y-2.5 max-h-96 overflow-y-auto">
                      {data.projects.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-lg bg-[#F4F5F7] flex items-center justify-between gap-3 text-sm"
                        >
                          <div>
                            <p className="font-semibold text-[#0B1E38]">{p.title}</p>
                            <p className="text-xs text-[#5A6475]">
                              {p.category} · {p.locationLabel}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Delete project ${p.title}`}
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Customer Reviews Manager */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
                    <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                      Manage Verified Reviews ({data.reviews.length})
                    </h2>
                    <form onSubmit={handleCreateReview} className="space-y-3 pb-5 border-b border-slate-200">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Verified customer name"
                          value={newReview.reviewerName}
                          onChange={(e) =>
                            setNewReview({ ...newReview, reviewerName: e.target.value })
                          }
                          className="h-10 px-3 rounded-lg border border-slate-200 text-sm"
                        />
                        <select
                          aria-label="Verified star rating"
                          value={newReview.rating}
                          onChange={(e) =>
                            setNewReview({ ...newReview, rating: Number(e.target.value) })
                          }
                          className="h-10 px-3 rounded-lg border border-slate-200 text-sm bg-white"
                        >
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                              {n} Stars
                            </option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Service type"
                        value={newReview.serviceType}
                        onChange={(e) =>
                          setNewReview({ ...newReview, serviceType: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
                      />
                      <textarea
                        rows={2}
                        required
                        placeholder="Verified customer review text"
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({ ...newReview, comment: e.target.value })
                        }
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#0B1E38] text-white text-xs font-semibold cursor-pointer"
                      >
                        Publish Verified Review
                      </button>
                    </form>

                    {data.reviews.length === 0 ? (
                      <p className="text-xs text-[#5A6475]">
                        No verified review excerpts published yet.
                      </p>
                    ) : (
                      <div className="space-y-2.5 max-h-96 overflow-y-auto">
                        {data.reviews.map((r) => (
                          <div
                            key={r.id}
                            className="p-3 rounded-lg bg-[#F4F5F7] flex items-center justify-between gap-3 text-sm"
                          >
                            <div>
                              <p className="font-semibold text-[#0B1E38]">
                                {r.reviewerName} ({r.rating}★)
                              </p>
                              <p className="text-xs text-[#5A6475] line-clamp-2">{r.comment}</p>
                            </div>
                            <button
                              type="button"
                              aria-label={`Delete review by ${r.reviewerName}`}
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: BUSINESS SETTINGS & INQUIRIES */}
              {tab === 'settings' && settingsDraft && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <form
                    onSubmit={handleSaveSettings}
                    className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4"
                  >
                    <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                      Business Contact &amp; Booking Availability
                    </h2>

                    <label className="flex items-center gap-3 p-3.5 rounded-lg bg-[#F4F5F7] border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settingsDraft.bookingAvailable}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            bookingAvailable: e.target.checked,
                          })
                        }
                        className="w-4 h-4 accent-[#1D6FF2]"
                      />
                      <span className="text-sm font-semibold text-[#0B1E38]">
                        Accept Online Booking Requests
                      </span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#0B1E38] mb-1">
                          Phone Display
                        </label>
                        <input
                          type="text"
                          value={settingsDraft.phoneDisplay}
                          onChange={(e) =>
                            setSettingsDraft({ ...settingsDraft, phoneDisplay: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono-num"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#0B1E38] mb-1">
                          WhatsApp Number (92...)
                        </label>
                        <input
                          type="text"
                          value={settingsDraft.whatsappNumber}
                          onChange={(e) =>
                            setSettingsDraft({ ...settingsDraft, whatsappNumber: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm font-mono-num"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1E38] mb-1">
                        Office Address
                      </label>
                      <input
                        type="text"
                        value={settingsDraft.address}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, address: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1E38] mb-1">
                        Business Hours
                      </label>
                      <input
                        type="text"
                        value={settingsDraft.hours}
                        onChange={(e) =>
                          setSettingsDraft({ ...settingsDraft, hours: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0B1E38] mb-1">
                        Confirmed Service Areas (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={areasText}
                        onChange={(e) => setAreasText(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#1D6FF2] hover:bg-[#1558C7] text-white text-xs font-semibold cursor-pointer"
                    >
                      Save Business Settings
                    </button>
                  </form>

                  <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                    <h2 className="font-display text-lg font-bold text-[#0B1E38]">
                      Customer Inquiries ({data.inquiries.length})
                    </h2>
                    {data.inquiries.length === 0 ? (
                      <p className="text-sm text-[#5A6475] py-8 text-center bg-[#F4F5F7] rounded-lg">
                        No contact inquiries received yet.
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {data.inquiries.map((inq) => (
                          <div
                            key={inq.id}
                            className="p-4 rounded-xl bg-[#F4F5F7] border border-slate-200 space-y-1 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <strong className="text-[#0B1E38]">{inq.name}</strong>
                              <span className="font-mono-num text-xs text-[#1D6FF2]">
                                {inq.phone}
                              </span>
                            </div>
                            <p className="text-xs text-[#5A6475]">
                              {inq.serviceCategory} {inq.address ? `· ${inq.address}` : ''}
                            </p>
                            <p className="text-sm text-[#1E2430] pt-1">{inq.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

const ServiceAdminRow: React.FC<{
  service: ServiceItem;
  onSave: (updates: Partial<ServiceItem>) => void;
  onDelete: () => void;
}> = ({ service, onSave, onDelete }) => {
  const [pricingType, setPricingType] = useState<PricingType>(service.pricingType);
  const [price, setPrice] = useState(service.pricePkr !== null ? String(service.pricePkr) : '');
  const [available, setAvailable] = useState(service.available);
  const [shortDesc, setShortDesc] = useState(service.shortDescription);

  return (
    <div className="p-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-bold text-[#0B1E38]">{service.name}</h3>
          <span className="text-xs text-[#5A6475]">({service.categorySlug})</span>
        </div>
        <input
          type="text"
          aria-label={`Description for ${service.name}`}
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs text-[#1E2430]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <select
          aria-label={`Pricing type for ${service.name}`}
          value={pricingType}
          onChange={(e) => setPricingType(e.target.value as PricingType)}
          className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs bg-white"
        >
          <option value="quote">Quote Required</option>
          <option value="fixed">Fixed Price</option>
          <option value="starting">Starting Price</option>
        </select>

        <input
          type="number"
          min={0}
          disabled={pricingType === 'quote'}
          aria-label={`PKR price for ${service.name}`}
          placeholder="PKR"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-24 h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-mono-num disabled:bg-slate-100"
        />

        <label className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0B1E38] cursor-pointer px-2">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="accent-[#15803D]"
          />
          <span>Active</span>
        </label>

        <button
          type="button"
          onClick={() =>
            onSave({
              pricingType,
              pricePkr: pricingType === 'quote' || !price.trim() ? null : Number(price),
              available,
              shortDescription: shortDesc,
            })
          }
          className="px-3 py-1.5 rounded-lg bg-[#0B1E38] hover:bg-[#132F56] text-white text-xs font-semibold cursor-pointer"
        >
          Save
        </button>

        <button
          type="button"
          aria-label={`Delete ${service.name}`}
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const CategoryAdminCard: React.FC<{
  category: ServiceCategory;
  onSave: (updates: { tagline: string; description: string }) => void;
}> = ({ category, onSave }) => {
  const [tagline, setTagline] = useState(category.tagline);
  const [description, setDescription] = useState(category.description);

  return (
    <div className="p-4 rounded-xl bg-[#F4F5F7] border border-slate-200 space-y-2.5">
      <h3 className="font-display text-sm font-bold text-[#0B1E38]">{category.name}</h3>
      <input
        type="text"
        value={tagline}
        onChange={(e) => setTagline(e.target.value)}
        className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs"
      />
      <textarea
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white text-xs"
      />
      <button
        type="button"
        onClick={() => onSave({ tagline, description })}
        className="px-3.5 py-1.5 rounded-lg bg-[#0B1E38] text-white text-xs font-semibold cursor-pointer"
      >
        Update Category
      </button>
    </div>
  );
};
