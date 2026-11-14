import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
import { Link, useDocumentMeta, useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';
import type {
  BookingAppointmentDetails,
  BookingCustomerInfo,
  BookingJobDetails,
  BookingRecord,
  PropertyType,
} from '../types/kaamfix';
import {
  buildWhatsAppBookingUrl,
  formatServicePrice,
  validateAppointmentStep,
  validateCustomerStep,
  validateJobDetailsStep,
} from '../utils/bookingLogic';

const TIME_SLOTS = [
  '08:30 AM - 11:00 AM',
  '11:00 AM - 02:00 PM',
  '02:00 PM - 05:00 PM',
  '05:00 PM - 08:00 PM',
  '08:00 PM - 10:00 PM',
];

const PROPERTY_TYPES: PropertyType[] = [
  'House',
  'Apartment',
  'Office',
  'Commercial Property',
  'Other',
];

export const BookPage: React.FC = () => {
  useDocumentMeta(
    'Book a Service | KAAM FIX Rawalpindi',
    'Complete your multi-service KAAM FIX booking request in 5 easy steps.'
  );

  const { navigate } = useRouter();
  const { cart, cartSummary, setQuantity, removeFromCart, clearCart, settings } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [customer, setCustomer] = useState<BookingCustomerInfo>({
    fullName: '',
    mobileNumber: '',
    email: '',
    streetAddress: '',
    areaSector: '',
    city: 'Rawalpindi',
    mapsLink: '',
  });
  const [appointment, setAppointment] = useState<BookingAppointmentDetails>({
    preferredDate: new Date().toISOString().split('T')[0],
    preferredTime: TIME_SLOTS[0],
    propertyType: 'House',
    serviceLocation: 'Rawalpindi',
    additionalInstructions: '',
  });
  const [jobDetails, setJobDetails] = useState<BookingJobDetails>({
    problemDescription: '',
    attachmentDataUrls: [],
    attachmentNames: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 1.5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          attachments: 'Each image must be under 1.5 MB.',
        }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setJobDetails((prev) => ({
            ...prev,
            attachmentDataUrls: [...prev.attachmentDataUrls, reader.result as string].slice(0, 4),
            attachmentNames: [...prev.attachmentNames, file.name].slice(0, 4),
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNext = () => {
    setErrors({});
    if (step === 1) {
      if (cart.length === 0) {
        setErrors({ cart: 'Please add at least one service before proceeding.' });
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      const stepErrors = validateCustomerStep(customer);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      const stepErrors = validateAppointmentStep(appointment);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      setStep(4);
      return;
    }
    if (step === 4) {
      const stepErrors = validateJobDetailsStep(jobDetails);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      setStep(5);
    }
  };

  const handleSubmitBooking = async () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer,
          appointment,
          jobDetails,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.booking) {
        setSubmitError(
          data.error ||
            'Unable to submit booking request right now. Please try again or book via WhatsApp.'
        );
        return;
      }

      setConfirmedBooking(data.booking as BookingRecord);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError(
        'Network error while reaching the KAAM FIX booking server. Please retry or send via WhatsApp.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedBooking) {
    const whatsappConfirmedUrl = buildWhatsAppBookingUrl(settings.whatsappNumber, {
      items: confirmedBooking.items,
      customer: confirmedBooking.customer,
      appointment: confirmedBooking.appointment,
      jobDetails: confirmedBooking.jobDetails,
      referenceCode: confirmedBooking.referenceCode,
    });

    return (
      <div className="pt-24 md:pt-28 pb-20 bg-[#F4F5F7] min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-10 shadow-xs">
            <div className="flex items-center gap-3 text-[#15803D]">
              <CheckCircle2 className="w-8 h-8 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Booking Request Received
                </p>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1E38]">
                  Reference: <span className="font-mono-num">{confirmedBooking.referenceCode}</span>
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#5A6475] leading-relaxed">
              Thank you, <strong className="text-[#0B1E38]">{confirmedBooking.customer.fullName}</strong>.
              We have received your booking request. Our team will contact you at{' '}
              <strong className="font-mono-num text-[#0B1E38]">
                {confirmedBooking.customer.mobileNumber}
              </strong>{' '}
              to confirm your time slot and price before any work starts.
            </p>

            <div className="mt-7 pt-6 border-t border-slate-200 space-y-6 text-sm">
              <div className="p-4 rounded-xl bg-[#F4F5F7] border border-slate-200">
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#5A6475] mb-2">
                  Requested Appointment
                </h2>
                <p className="font-semibold text-[#0B1E38]">
                  {confirmedBooking.appointment.preferredDate} · {confirmedBooking.appointment.preferredTime}
                </p>
                <p className="text-[#5A6475] mt-1">
                  Property: {confirmedBooking.appointment.propertyType}
                </p>
                <p className="text-[#5A6475] mt-1">
                  {confirmedBooking.customer.streetAddress}, {confirmedBooking.customer.areaSector},{' '}
                  {confirmedBooking.customer.city}
                </p>
              </div>

              <div>
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#5A6475] mb-2.5">
                  Selected Services ({confirmedBooking.items.length})
                </h2>
                <ul className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {confirmedBooking.items.map((item) => (
                    <li
                      key={item.serviceId}
                      className="px-4 py-3 flex items-baseline justify-between gap-4"
                    >
                      <span className="text-[#0B1E38] font-medium min-w-0">
                        {item.serviceName}{' '}
                        <span className="text-[#5A6475] font-mono-num whitespace-nowrap shrink-0">
                          × {item.quantity}
                        </span>
                      </span>
                      <span className="font-mono-num text-xs font-semibold text-[#1D6FF2] whitespace-nowrap shrink-0">
                        {formatServicePrice(item.pricingType, item.pricePkr, 'short')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-3">
              <a
                href={whatsappConfirmedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-animated btn-grad-emerald inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Send Confirmation to WhatsApp</span>
              </a>
              <Link
                to="/services"
                className="btn-animated inline-flex items-center px-5 py-3 rounded-lg bg-[#F4F5F7] hover:bg-slate-200 text-[#0B1E38] text-sm font-semibold whitespace-nowrap"
              >
                Browse More Services
              </Link>
              <Link
                to="/"
                className="btn-animated inline-flex items-center px-5 py-3 rounded-lg border border-slate-200 text-[#0B1E38] text-sm font-semibold hover:bg-slate-50 whitespace-nowrap"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stepsMeta = [
    { num: 1, label: 'Selected Services' },
    { num: 2, label: 'Customer Info' },
    { num: 3, label: 'Appointment' },
    { num: 4, label: 'Job Details' },
    { num: 5, label: 'Review & Submit' },
  ];

  const whatsappDirectUrl = buildWhatsAppBookingUrl(settings.whatsappNumber, {
    items: cart,
    customer,
    appointment,
    jobDetails,
  });

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-gradient-to-b from-sky-50/40 via-[#F4F5F7] to-amber-50/30 min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#0D9488]">
            Booking Request
          </p>
          <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-bold text-[#0B1E38] tracking-tight">
            Book Your Services
          </h1>
          {!settings.bookingAvailable && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-900">
              Online booking submissions are currently paused. You can still prepare your cart and
              contact us directly at {settings.phoneDisplay} or via WhatsApp.
            </div>
          )}
        </div>

        {/* Stepper Header */}
        <nav aria-label="Booking progress" className="mb-8">
          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {stepsMeta.map((s) => {
              const isCurrent = step === s.num;
              const isDone = step > s.num;
              return (
                <li
                  key={s.num}
                  className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#0B1E38] via-[#1D6FF2] to-[#0D9488] text-white border-transparent shadow-xs'
                      : isDone
                      ? 'bg-emerald-50/70 text-[#15803D] border-emerald-200'
                      : 'bg-white/80 text-[#5A6475] border-slate-200'
                  }`}
                >
                  <span className="font-mono-num">0{s.num}.</span>
                  <span className="truncate">{s.label}</span>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          {/* STEP 1 — SELECTED SERVICES */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                    Step 1 — Selected Services
                  </h2>
                  <p className="text-sm text-[#5A6475] mt-1">
                    Review or adjust your selected services before entering your contact details.
                  </p>
                </div>
                <Link
                  to="/services"
                  className="text-sm font-semibold text-[#1D6FF2] hover:underline"
                >
                  + Add Another Service
                </Link>
              </div>

              {errors.cart && (
                <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {errors.cart}
                </div>
              )}

              {cart.length === 0 ? (
                <div className="py-10 text-center bg-[#F4F5F7] rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-[#0B1E38]">
                    No services are currently in your cart.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/services')}
                    className="btn-animated btn-grad-primary mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Browse Services to Add
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
                  {cart.map((item) => (
                    <div
                      key={item.serviceId}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F4F5F7] shrink-0">
                          <SafeImage
                            imageKey={item.imageKey}
                            customUrl={item.customImageUrl}
                            alt={item.serviceName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-[#5A6475]">{item.categoryName}</p>
                          <h3 className="font-display text-sm sm:text-base font-bold text-[#0B1E38]">
                            {item.serviceName}
                          </h3>
                          <p className="text-xs font-mono-num text-[#1D6FF2]">
                            {formatServicePrice(item.pricingType, item.pricePkr, 'short')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-[#F4F5F7]">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.serviceName}`}
                            onClick={() => setQuantity(item.serviceId, item.quantity - 1)}
                            className="w-9 h-9 inline-flex items-center justify-center text-[#0B1E38] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-sm font-semibold font-mono-num">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.serviceName}`}
                            onClick={() => setQuantity(item.serviceId, item.quantity + 1)}
                            className="w-9 h-9 inline-flex items-center justify-center text-[#0B1E38] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.serviceName}`}
                          onClick={() => removeFromCart(item.serviceId)}
                          className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — CUSTOMER INFORMATION */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                  Step 2 — Customer Information
                </h2>
                <p className="text-sm text-[#5A6475] mt-1">
                  Enter your name, phone number, and address in Rawalpindi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bf-fullName" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="bf-fullName"
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                    placeholder="e.g., Muhammad Bilal"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="bf-mobile" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    id="bf-mobile"
                    type="tel"
                    value={customer.mobileNumber}
                    onChange={(e) => setCustomer({ ...customer, mobileNumber: e.target.value })}
                    placeholder="e.g., 0301 6800786"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm font-mono-num focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.mobileNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bf-email" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    id="bf-email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="bf-city" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    City *
                  </label>
                  <input
                    id="bf-city"
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bf-street" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    House / Street Address *
                  </label>
                  <input
                    id="bf-street"
                    type="text"
                    value={customer.streetAddress}
                    onChange={(e) => setCustomer({ ...customer, streetAddress: e.target.value })}
                    placeholder="House number, street name, apartment/floor"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.streetAddress && (
                    <p className="mt-1 text-xs text-red-600">{errors.streetAddress}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bf-area" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Area / Sector *
                  </label>
                  <input
                    id="bf-area"
                    type="text"
                    value={customer.areaSector}
                    onChange={(e) => setCustomer({ ...customer, areaSector: e.target.value })}
                    placeholder="e.g., Satellite Town Block D"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.areaSector && (
                    <p className="mt-1 text-xs text-red-600">{errors.areaSector}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bf-maps" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Google Maps Location Link (Optional)
                  </label>
                  <input
                    id="bf-maps"
                    type="url"
                    value={customer.mapsLink}
                    onChange={(e) => setCustomer({ ...customer, mapsLink: e.target.value })}
                    placeholder="https://maps.google.com/..."
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — APPOINTMENT DETAILS */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                  Step 3 — Appointment Details
                </h2>
                <p className="text-sm text-[#5A6475] mt-1">
                  Business Hours: {settings.hours}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bf-date" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    id="bf-date"
                    type="date"
                    value={appointment.preferredDate}
                    onChange={(e) =>
                      setAppointment({ ...appointment, preferredDate: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm font-mono-num focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                  {errors.preferredDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bf-time" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Preferred Time *
                  </label>
                  <select
                    id="bf-time"
                    value={appointment.preferredTime}
                    onChange={(e) =>
                      setAppointment({ ...appointment, preferredTime: e.target.value })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-2 focus:outline-[#1D6FF2]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.preferredTime && (
                    <p className="mt-1 text-xs text-red-600">{errors.preferredTime}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bf-property" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Type of Property *
                  </label>
                  <select
                    id="bf-property"
                    value={appointment.propertyType}
                    onChange={(e) =>
                      setAppointment({
                        ...appointment,
                        propertyType: e.target.value as PropertyType,
                      })
                    }
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm bg-white focus:outline-2 focus:outline-[#1D6FF2]"
                  >
                    {PROPERTY_TYPES.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bf-location" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Area / City
                  </label>
                  <input
                    id="bf-location"
                    type="text"
                    value={appointment.serviceLocation}
                    onChange={(e) =>
                      setAppointment({ ...appointment, serviceLocation: e.target.value })
                    }
                    placeholder="Rawalpindi / Nearby area"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bf-instructions" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    id="bf-instructions"
                    rows={3}
                    value={appointment.additionalInstructions}
                    onChange={(e) =>
                      setAppointment({ ...appointment, additionalInstructions: e.target.value })
                    }
                    placeholder="Gate entry instructions, parking notes, or preferred contact window..."
                    className="w-full p-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — JOB DETAILS & OPTIONAL PHOTO UPLOAD */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                  Step 4 — Job Details &amp; Photos
                </h2>
                <p className="text-sm text-[#5A6475] mt-1">
                  Briefly explain what needs fixing or installing so our team brings the right
                  tools.
                </p>
              </div>

              <div>
                <label htmlFor="bf-problem" className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                  Describe the Problem or Work Needed *
                </label>
                <textarea
                  id="bf-problem"
                  rows={4}
                  value={jobDetails.problemDescription}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, problemDescription: e.target.value })
                  }
                  placeholder="Example: 2 ceiling fans to install in bedrooms, kitchen mixer tap is dripping, and one main bedroom door latch needs alignment."
                  className="w-full p-3.5 rounded-lg border border-slate-200 text-sm focus:outline-2 focus:outline-[#1D6FF2]"
                />
                {errors.problemDescription && (
                  <p className="mt-1 text-xs text-red-600">{errors.problemDescription}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1E38] mb-1.5">
                  Optional Photos (Damaged fixtures, plumbing leaks, electrical panel, painting/renovation areas)
                </label>
                <label className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-slate-300 bg-[#F4F5F7] hover:bg-slate-200/50 cursor-pointer text-center">
                  <Upload className="w-6 h-6 text-[#1D6FF2] mb-2" aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#0B1E38]">
                    Attach up to 4 images
                  </span>
                  <span className="text-xs text-[#5A6475] mt-1">
                    JPG or PNG, max 1.5 MB each
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
                {errors.attachments && (
                  <p className="mt-1 text-xs text-red-600">{errors.attachments}</p>
                )}

                {jobDetails.attachmentDataUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {jobDetails.attachmentDataUrls.map((dataUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-lg overflow-hidden border border-slate-200 aspect-square bg-[#F4F5F7]"
                      >
                        <img
                          src={dataUrl}
                          alt={jobDetails.attachmentNames[idx] || `Attachment ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          aria-label={`Remove attachment ${idx + 1}`}
                          onClick={() =>
                            setJobDetails((prev) => ({
                              ...prev,
                              attachmentDataUrls: prev.attachmentDataUrls.filter((_, i) => i !== idx),
                              attachmentNames: prev.attachmentNames.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-black/75 text-white text-xs cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5 — REVIEW AND SUBMIT */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-[#0B1E38]">
                  Step 5 — Review and Submit
                </h2>
                <p className="text-sm text-[#5A6475] mt-1">
                  Please confirm all details below before submitting your booking request.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F4F5F7] rounded-xl p-5 border border-slate-200 text-sm">
                <div className="space-y-2">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#5A6475]">
                    Customer Details
                  </h3>
                  <p className="font-semibold text-[#0B1E38]">{customer.fullName}</p>
                  <p className="font-mono-num text-[#1E2430]">{customer.mobileNumber}</p>
                  {customer.email && <p className="text-[#5A6475]">{customer.email}</p>}
                  <p className="text-[#5A6475]">
                    {customer.streetAddress}, {customer.areaSector}, {customer.city}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#5A6475]">
                    Visit Date &amp; Time
                  </h3>
                  <p className="font-semibold text-[#0B1E38]">
                    {appointment.preferredDate} · {appointment.preferredTime}
                  </p>
                  <p className="text-[#5A6475]">Property: {appointment.propertyType}</p>
                  <p className="text-[#5A6475]">
                    Job Notes: {jobDetails.problemDescription}
                  </p>
                  {appointment.additionalInstructions && (
                    <p className="text-[#5A6475]">
                      Extra Instructions: {appointment.additionalInstructions}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-display text-sm font-bold text-[#0B1E38] mb-3">
                  Selected Services ({cart.length})
                </h3>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div
                      key={item.serviceId}
                      className="px-4 py-3 flex items-center justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-[#0B1E38]">{item.serviceName}</span>{' '}
                        <span className="text-[#5A6475] font-mono-num whitespace-nowrap shrink-0">
                          × {item.quantity}
                        </span>
                        {item.notes && (
                          <p className="text-xs text-[#5A6475] mt-0.5">Note: {item.notes}</p>
                        )}
                      </div>
                      <span className="font-mono-num font-semibold text-[#1D6FF2] whitespace-nowrap shrink-0">
                        {formatServicePrice(item.pricingType, item.pricePkr, 'short')}
                      </span>
                    </div>
                  ))}
                  <div className="px-4 py-3 bg-[#F4F5F7] flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-[#0B1E38]">Price Summary</span>
                    <span className="font-mono-num font-bold text-[#0B1E38] whitespace-nowrap shrink-0">
                      {cartSummary.summaryLabel}
                    </span>
                  </div>
                </div>
              </div>

              {submitError && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={submitting || !settings.bookingAvailable}
                  onClick={handleSubmitBooking}
                  className="group btn-animated btn-grad-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-lg disabled:opacity-50 text-sm font-semibold cursor-pointer whitespace-nowrap"
                >
                  <span>{submitting ? 'Submitting Request...' : 'Submit Booking Request'}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </button>

                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-animated btn-grad-emerald inline-flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Stepper Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5)}
                className="btn-animated inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-[#0B1E38] hover:bg-[#F4F5F7] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/cart"
                className="text-sm font-semibold text-[#5A6475] hover:text-[#0B1E38]"
              >
                ← Back to Cart
              </Link>
            )}

            {step < 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="group btn-animated btn-grad-dark inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
