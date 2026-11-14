import type {
  AdminAnalytics,
  BookingAppointmentDetails,
  BookingCustomerInfo,
  BookingJobDetails,
  BookingRecord,
  BookingStatus,
  CartItem,
  PricingType,
  ServiceCategory,
  ServiceItem,
} from '../types/kaamfix';

export const BOOKING_STATUSES: BookingStatus[] = [
  'New Request',
  'Contacted',
  'Quotation Sent',
  'Confirmed',
  'In Progress',
  'Completed',
  'Cancelled',
];

export interface CartPricingSummary {
  totalUnits: number;
  distinctServices: number;
  fixedSubtotalPkr: number;
  startingSubtotalPkr: number;
  hasFixedItems: boolean;
  hasStartingItems: boolean;
  hasQuoteItems: boolean;
  pricingMode: 'empty' | 'fixed-only' | 'starting-only' | 'quote-required' | 'mixed';
  summaryLabel: string;
  explanation: string;
}

export function formatPkr(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function formatServicePrice(
  pricingType: PricingType,
  pricePkr: number | null,
  variant: 'short' | 'cta' = 'short'
): string {
  if (pricingType === 'fixed' && pricePkr !== null && pricePkr > 0) {
    return formatPkr(pricePkr);
  }
  if (pricingType === 'starting' && pricePkr !== null && pricePkr > 0) {
    return `Starting from ${formatPkr(pricePkr)}`;
  }
  return variant === 'cta' ? 'Get a Quote' : 'Price on Request';
}

export function addItemToCart(
  currentItems: CartItem[],
  service: ServiceItem,
  categoryName: string,
  quantity = 1,
  notes = ''
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(quantity));
  const existingIndex = currentItems.findIndex((item) => item.serviceId === service.id);

  if (existingIndex >= 0) {
    return currentItems.map((item, idx) =>
      idx === existingIndex
        ? {
            ...item,
            quantity: item.quantity + safeQty,
            notes: notes.trim() ? notes.trim() : item.notes,
            pricingType: service.pricingType,
            pricePkr: service.pricePkr,
            customImageUrl: service.customImageUrl,
          }
        : item
    );
  }

  return [
    ...currentItems,
    {
      serviceId: service.id,
      serviceName: service.name,
      categorySlug: service.categorySlug,
      categoryName,
      imageKey: service.imageKey,
      customImageUrl: service.customImageUrl,
      pricingType: service.pricingType,
      pricePkr: service.pricePkr,
      unitLabel: service.unitLabel,
      quantity: safeQty,
      notes: notes.trim(),
    },
  ];
}

export function updateItemQuantity(
  currentItems: CartItem[],
  serviceId: string,
  nextQuantity: number
): CartItem[] {
  if (nextQuantity <= 0) {
    return currentItems.filter((item) => item.serviceId !== serviceId);
  }
  return currentItems.map((item) =>
    item.serviceId === serviceId
      ? { ...item, quantity: Math.min(99, Math.floor(nextQuantity)) }
      : item
  );
}

export function updateItemNotes(
  currentItems: CartItem[],
  serviceId: string,
  notes: string
): CartItem[] {
  return currentItems.map((item) =>
    item.serviceId === serviceId ? { ...item, notes } : item
  );
}

export function removeItemFromCart(
  currentItems: CartItem[],
  serviceId: string
): CartItem[] {
  return currentItems.filter((item) => item.serviceId !== serviceId);
}

export function calculateCartSummary(items: CartItem[]): CartPricingSummary {
  if (items.length === 0) {
    return {
      totalUnits: 0,
      distinctServices: 0,
      fixedSubtotalPkr: 0,
      startingSubtotalPkr: 0,
      hasFixedItems: false,
      hasStartingItems: false,
      hasQuoteItems: false,
      pricingMode: 'empty',
      summaryLabel: 'No services selected',
      explanation: 'Add one or more services to your cart to request a combined booking.',
    };
  }

  let totalUnits = 0;
  let fixedSubtotalPkr = 0;
  let startingSubtotalPkr = 0;
  let hasFixedItems = false;
  let hasStartingItems = false;
  let hasQuoteItems = false;

  for (const item of items) {
    totalUnits += item.quantity;
    if (item.pricingType === 'fixed' && item.pricePkr !== null && item.pricePkr > 0) {
      hasFixedItems = true;
      fixedSubtotalPkr += item.pricePkr * item.quantity;
    } else if (item.pricingType === 'starting' && item.pricePkr !== null && item.pricePkr > 0) {
      hasStartingItems = true;
      startingSubtotalPkr += item.pricePkr * item.quantity;
    } else {
      hasQuoteItems = true;
    }
  }

  if (hasFixedItems && !hasStartingItems && !hasQuoteItems) {
    return {
      totalUnits,
      distinctServices: items.length,
      fixedSubtotalPkr,
      startingSubtotalPkr: 0,
      hasFixedItems,
      hasStartingItems,
      hasQuoteItems,
      pricingMode: 'fixed-only',
      summaryLabel: formatPkr(fixedSubtotalPkr),
      explanation: 'Fixed-rate total for your selected jobs. We will confirm before sending our team.',
    };
  }

  if (!hasFixedItems && hasStartingItems && !hasQuoteItems) {
    return {
      totalUnits,
      distinctServices: items.length,
      fixedSubtotalPkr: 0,
      startingSubtotalPkr,
      hasFixedItems,
      hasStartingItems,
      hasQuoteItems,
      pricingMode: 'starting-only',
      summaryLabel: `Starting from ${formatPkr(startingSubtotalPkr)}`,
      explanation: 'Final price depends on the exact work needed on site and will be shared with you first.',
    };
  }

  if (!hasFixedItems && !hasStartingItems && hasQuoteItems) {
    return {
      totalUnits,
      distinctServices: items.length,
      fixedSubtotalPkr: 0,
      startingSubtotalPkr: 0,
      hasFixedItems,
      hasStartingItems,
      hasQuoteItems,
      pricingMode: 'quote-required',
      summaryLabel: 'Quote Required',
      explanation:
        'We will review your job details and confirm the exact price with you before starting any work.',
    };
  }

  const parts: string[] = [];
  if (fixedSubtotalPkr > 0) {
    parts.push(`${formatPkr(fixedSubtotalPkr)} fixed`);
  }
  if (startingSubtotalPkr > 0) {
    parts.push(`from ${formatPkr(startingSubtotalPkr)}`);
  }
  if (hasQuoteItems) {
    parts.push('Quote required items');
  }

  return {
    totalUnits,
    distinctServices: items.length,
    fixedSubtotalPkr,
    startingSubtotalPkr,
    hasFixedItems,
    hasStartingItems,
    hasQuoteItems,
    pricingMode: 'mixed',
    summaryLabel: parts.join(' + '),
    explanation:
      'Some selected jobs need a quick inspection or quote first. We will confirm the total cost with you before work starts.',
  };
}

export interface WhatsAppMessagePayload {
  items: CartItem[];
  customer?: Partial<BookingCustomerInfo>;
  appointment?: Partial<BookingAppointmentDetails>;
  jobDetails?: Partial<BookingJobDetails>;
  referenceCode?: string;
}

export function buildWhatsAppMessage(payload: WhatsAppMessagePayload): string {
  const { items, customer, appointment, jobDetails, referenceCode } = payload;
  const summary = calculateCartSummary(items);

  const lines: string[] = [
    'Hello KAAM FIX, I would like to request a booking.',
  ];

  if (referenceCode) {
    lines.push(`Booking Reference: ${referenceCode}`);
  }

  lines.push('');
  lines.push(`Name: ${customer?.fullName?.trim() || 'To be confirmed'}`);
  if (customer?.mobileNumber?.trim()) {
    lines.push(`Mobile: ${customer.mobileNumber.trim()}`);
  }

  const addressParts = [
    customer?.streetAddress?.trim(),
    customer?.areaSector?.trim(),
    customer?.city?.trim(),
  ].filter(Boolean);
  lines.push(`Address: ${addressParts.length > 0 ? addressParts.join(', ') : 'To be confirmed'}`);

  if (customer?.mapsLink?.trim()) {
    lines.push(`Map Link: ${customer.mapsLink.trim()}`);
  }

  lines.push('');
  lines.push('Selected Services:');
  items.forEach((item, index) => {
    const priceText = formatServicePrice(item.pricingType, item.pricePkr, 'short');
    const noteSuffix = item.notes.trim() ? ` (Note: ${item.notes.trim()})` : '';
    lines.push(`${index + 1}. ${item.serviceName} × ${item.quantity} — ${priceText}${noteSuffix}`);
  });

  lines.push('');
  lines.push(`Pricing Status: ${summary.summaryLabel}`);
  if (appointment?.preferredDate) {
    lines.push(`Preferred Date: ${appointment.preferredDate}`);
  }
  if (appointment?.preferredTime) {
    lines.push(`Preferred Time: ${appointment.preferredTime}`);
  }
  if (appointment?.propertyType) {
    lines.push(`Property Type: ${appointment.propertyType}`);
  }

  const extraNotes = [
    jobDetails?.problemDescription?.trim(),
    appointment?.additionalInstructions?.trim(),
  ]
    .filter(Boolean)
    .join(' | ');

  if (extraNotes) {
    lines.push(`Additional Details: ${extraNotes}`);
  }

  lines.push('');
  lines.push('Please confirm availability and pricing.');
  return lines.join('\n');
}

export function buildWhatsAppBookingUrl(
  whatsappNumber: string,
  payload: WhatsAppMessagePayload
): string {
  const text = buildWhatsAppMessage(payload);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function validateCustomerStep(customer: BookingCustomerInfo): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!customer.fullName.trim() || customer.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }
  const digits = customer.mobileNumber.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    errors.mobileNumber = 'Please enter a valid mobile number (e.g. 0301 6800786).';
  }
  if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
    errors.email = 'Please enter a valid email address or leave it blank.';
  }
  if (!customer.streetAddress.trim()) {
    errors.streetAddress = 'Please enter your house or street address.';
  }
  if (!customer.areaSector.trim()) {
    errors.areaSector = 'Please specify your area or sector.';
  }
  if (!customer.city.trim()) {
    errors.city = 'Please enter your city.';
  }
  return errors;
}

export function validateAppointmentStep(
  appointment: BookingAppointmentDetails
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!appointment.preferredDate.trim()) {
    errors.preferredDate = 'Please select a preferred service date.';
  }
  if (!appointment.preferredTime.trim()) {
    errors.preferredTime = 'Please select a preferred time window.';
  }
  if (!appointment.propertyType) {
    errors.propertyType = 'Please select the property type.';
  }
  return errors;
}

export function validateJobDetailsStep(job: BookingJobDetails): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!job.problemDescription.trim() || job.problemDescription.trim().length < 8) {
    errors.problemDescription = 'Please briefly describe the repair or work required (at least 8 characters).';
  }
  return errors;
}

export function generateBookingReference(date = new Date(), randomSuffix?: number): string {
  const year = date.getFullYear();
  const suffix =
    typeof randomSuffix === 'number'
      ? Math.abs(Math.floor(randomSuffix)) % 10000
      : Math.floor(1000 + Math.random() * 9000);
  return `KF-${year}-${String(suffix).padStart(4, '0')}`;
}

export function computeAdminAnalytics(
  bookings: BookingRecord[],
  categories: ServiceCategory[]
): AdminAnalytics {
  let newRequests = 0;
  let activeBookings = 0;
  let completedBookings = 0;
  let totalConfirmedRevenuePkr = 0;
  let quotePendingCount = 0;

  const categoryMap = new Map<string, { categoryName: string; count: number; revenuePkr: number }>();
  for (const cat of categories) {
    categoryMap.set(cat.slug, { categoryName: cat.shortName, count: 0, revenuePkr: 0 });
  }

  const monthMap = new Map<string, { month: string; bookings: number; revenuePkr: number }>();

  for (const booking of bookings) {
    if (booking.status === 'New Request') newRequests += 1;
    if (
      booking.status === 'Contacted' ||
      booking.status === 'Quotation Sent' ||
      booking.status === 'Confirmed' ||
      booking.status === 'In Progress'
    ) {
      activeBookings += 1;
    }
    if (booking.status === 'Completed') completedBookings += 1;

    const bookingRevenue =
      booking.status !== 'Cancelled' && typeof booking.quotedTotalPkr === 'number' && booking.quotedTotalPkr > 0
        ? booking.quotedTotalPkr
        : 0;

    if (bookingRevenue > 0) {
      totalConfirmedRevenuePkr += bookingRevenue;
    } else if (booking.status !== 'Cancelled') {
      quotePendingCount += 1;
    }

    const totalUnits = booking.items.reduce((sum, item) => sum + item.quantity, 0) || 1;
    for (const item of booking.items) {
      const entry = categoryMap.get(item.categorySlug) ?? {
        categoryName: item.categoryName,
        count: 0,
        revenuePkr: 0,
      };
      entry.count += item.quantity;
      if (bookingRevenue > 0) {
        entry.revenuePkr += Math.round((bookingRevenue * item.quantity) / totalUnits);
      }
      categoryMap.set(item.categorySlug, entry);
    }

    const parsedDate = new Date(booking.createdAt);
    const monthKey = Number.isNaN(parsedDate.getTime())
      ? 'Current'
      : `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = Number.isNaN(parsedDate.getTime())
      ? 'Current'
      : parsedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const mEntry = monthMap.get(monthKey) ?? { month: monthLabel, bookings: 0, revenuePkr: 0 };
    mEntry.bookings += 1;
    mEntry.revenuePkr += bookingRevenue;
    monthMap.set(monthKey, mEntry);
  }

  const monthlyTrends = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);

  return {
    totalBookings: bookings.length,
    newRequests,
    activeBookings,
    completedBookings,
    totalConfirmedRevenuePkr,
    quotePendingCount,
    categoryCounts: Array.from(categoryMap.values()),
    monthlyTrends,
  };
}
