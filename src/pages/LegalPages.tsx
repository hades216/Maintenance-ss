import React from 'react';
import { Link, useDocumentMeta } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';

export const PrivacyPolicyPage: React.FC = () => {
  useDocumentMeta(
    'Privacy Policy | KAAM FIX Rawalpindi',
    'Privacy Policy explaining how KAAM FIX handles customer booking, contact, and service request information.'
  );
  const { settings } = useStore();

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-[#F4F5F7] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-10 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
              Legal Information
            </p>
            <h1 className="mt-1.5 font-display text-3xl font-bold text-[#0B1E38]">
              Privacy Policy
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#5A6475] leading-relaxed">
            <p>
              KAAM FIX respects your privacy and only collects the details needed to arrange and
              complete your home repair, maintenance, or construction job.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0B1E38] pt-2">
              Information We Collect
            </h2>
            <p>
              When you book a service or send a message, we collect your name, mobile number,
              optional email, home address, preferred visit date and time, selected jobs, notes,
              and any photos you attach.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0B1E38] pt-2">
              How We Use Your Information
            </h2>
            <p>
              We only use your details to check worker availability, give you a quote, send the
              right technician to your home, and share updates by phone or WhatsApp. Your cart is
              saved in your browser so you do not lose your selected jobs if you refresh the page.
            </p>
            <h2 className="font-display text-lg font-bold text-[#0B1E38] pt-2">
              Contact &amp; Data Requests
            </h2>
            <p>
              If you would like to update or remove a previously submitted inquiry or booking
              record, contact KAAM FIX at {settings.phoneDisplay} or visit {settings.address}.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link to="/contact" className="text-sm font-semibold text-[#1D6FF2] hover:underline">
              Contact KAAM FIX →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TermsConditionsPage: React.FC = () => {
  useDocumentMeta(
    'Terms & Conditions | KAAM FIX Rawalpindi',
    'Terms and conditions governing service bookings, quotations, and doorstep visits by KAAM FIX.'
  );
  const { settings } = useStore();

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-[#F4F5F7] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-10 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#1D6FF2]">
              Legal Information
            </p>
            <h1 className="mt-1.5 font-display text-3xl font-bold text-[#0B1E38]">
              Terms &amp; Conditions
            </h1>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[#5A6475] leading-relaxed">
            <h2 className="font-display text-lg font-bold text-[#0B1E38]">
              1. Service Requests &amp; Confirmation
            </h2>
            <p>
              Sending your cart through the KAAM FIX website or WhatsApp creates a booking request.
              Our team confirms the visit date, time slot, and area availability when we call or
              message you.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0B1E38] pt-2">
              2. Pricing &amp; Quotations
            </h2>
            <p>
              Services marked &ldquo;Price on Request&rdquo; or &ldquo;Starting from&rdquo; need a
              quick look or job details first. We always share the price clearly before starting
              any work.
            </p>

            <h2 className="font-display text-lg font-bold text-[#0B1E38] pt-2">
              3. Rescheduling &amp; Cancellations
            </h2>
            <p>
              To modify or cancel an existing request, please call {settings.phoneDisplay} or
              message us on WhatsApp with your booking reference code during business hours (
              {settings.hours}).
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link to="/book" className="text-sm font-semibold text-[#1D6FF2] hover:underline">
              Proceed to Booking →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
