import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addItemToCart,
  buildWhatsAppBookingUrl,
  buildWhatsAppMessage,
  calculateCartSummary,
  computeAdminAnalytics,
  formatServicePrice,
  generateBookingReference,
  removeItemFromCart,
  updateItemQuantity,
  validateAppointmentStep,
  validateCustomerStep,
  validateJobDetailsStep,
} from './bookingLogic';
import { INITIAL_SERVICES, SERVICE_CATEGORIES } from '../data/catalog';
import type { BookingRecord, ServiceItem } from '../types/kaamfix';

const fanService: ServiceItem = {
  ...INITIAL_SERVICES.find((s) => s.id === 'elec-fan')!,
};

const tapService: ServiceItem = {
  ...INITIAL_SERVICES.find((s) => s.id === 'plumb-tap-repair')!,
  pricingType: 'fixed',
  pricePkr: 1200,
};

const doorService: ServiceItem = {
  ...INITIAL_SERVICES.find((s) => s.id === 'carp-door-repair')!,
  pricingType: 'starting',
  pricePkr: 1500,
};

test('addItemToCart adds new service and increments quantity on repeat add', () => {
  let cart = addItemToCart([], fanService, 'Electrical Services', 1);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);

  cart = addItemToCart(cart, fanService, 'Electrical Services', 1, '2 bedrooms');
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
  assert.equal(cart[0].notes, '2 bedrooms');

  cart = addItemToCart(cart, tapService, 'Plumbing Services', 1);
  assert.equal(cart.length, 2);
});

test('updateItemQuantity and removeItemFromCart manage cart state accurately', () => {
  let cart = addItemToCart([], fanService, 'Electrical Services', 2);
  cart = addItemToCart(cart, tapService, 'Plumbing Services', 1);

  cart = updateItemQuantity(cart, fanService.id, 3);
  assert.equal(cart[0].quantity, 3);

  cart = updateItemQuantity(cart, fanService.id, 0);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].serviceId, tapService.id);

  cart = removeItemFromCart(cart, tapService.id);
  assert.equal(cart.length, 0);
});

test('calculateCartSummary handles quote-only, fixed-only, and mixed pricing without inventing fake totals', () => {
  const quoteCart = addItemToCart([], fanService, 'Electrical Services', 2);
  const quoteSummary = calculateCartSummary(quoteCart);
  assert.equal(quoteSummary.pricingMode, 'quote-required');
  assert.equal(quoteSummary.summaryLabel, 'Quote Required');
  assert.equal(quoteSummary.totalUnits, 2);
  assert.equal(quoteSummary.fixedSubtotalPkr, 0);

  const fixedCart = addItemToCart([], tapService, 'Plumbing Services', 2);
  const fixedSummary = calculateCartSummary(fixedCart);
  assert.equal(fixedSummary.pricingMode, 'fixed-only');
  assert.equal(fixedSummary.fixedSubtotalPkr, 2400);
  assert.equal(fixedSummary.summaryLabel, 'PKR 2,400');

  let mixedCart = addItemToCart([], tapService, 'Plumbing Services', 1);
  mixedCart = addItemToCart(mixedCart, fanService, 'Electrical Services', 2);
  mixedCart = addItemToCart(mixedCart, doorService, 'Carpentry Services', 1);
  const mixedSummary = calculateCartSummary(mixedCart);
  assert.equal(mixedSummary.pricingMode, 'mixed');
  assert.equal(mixedSummary.totalUnits, 4);
  assert.equal(mixedSummary.fixedSubtotalPkr, 1200);
  assert.equal(mixedSummary.startingSubtotalPkr, 1500);
  assert.equal(mixedSummary.hasQuoteItems, true);
});

test('formatServicePrice formats fixed, starting, and quote states accurately', () => {
  assert.equal(formatServicePrice('quote', null, 'short'), 'Price on Request');
  assert.equal(formatServicePrice('quote', null, 'cta'), 'Get a Quote');
  assert.equal(formatServicePrice('fixed', 2500), 'PKR 2,500');
  assert.equal(formatServicePrice('starting', 1800), 'Starting from PKR 1,800');
});

test('buildWhatsAppMessage and URL include full cart and customer details', () => {
  let cart = addItemToCart([], fanService, 'Electrical Services', 2);
  cart = addItemToCart(cart, tapService, 'Plumbing Services', 1);

  const message = buildWhatsAppMessage({
    items: cart,
    customer: {
      fullName: 'Usman Tariq',
      mobileNumber: '03016800786',
      streetAddress: 'House 12, Street 4',
      areaSector: 'Satellite Town Block D',
      city: 'Rawalpindi',
    },
    appointment: {
      preferredDate: '2026-11-20',
      preferredTime: '10:00 AM - 12:00 PM',
      propertyType: 'House',
    },
    jobDetails: {
      problemDescription: 'Two ceiling fans to install and kitchen tap leaking.',
    },
    referenceCode: 'KF-2026-4102',
  });

  assert.match(message, /Booking Reference: KF-2026-4102/);
  assert.match(message, /1\. Ceiling & Exhaust Fan Installation × 2/);
  assert.match(message, /2\. Tap & Faucet Repair × 1/);
  assert.match(message, /Satellite Town Block D, Rawalpindi/);

  const url = buildWhatsAppBookingUrl('923016800786', { items: cart });
  assert.ok(url.startsWith('https://wa.me/923016800786?text='));
});

test('booking step validators reject missing required fields and accept valid inputs', () => {
  const badCustomer = validateCustomerStep({
    fullName: '',
    mobileNumber: '123',
    email: 'not-an-email',
    streetAddress: '',
    areaSector: '',
    city: '',
    mapsLink: '',
  });
  assert.ok(badCustomer.fullName);
  assert.ok(badCustomer.mobileNumber);
  assert.ok(badCustomer.email);
  assert.ok(badCustomer.streetAddress);

  const goodCustomer = validateCustomerStep({
    fullName: 'Bilal Ahmed',
    mobileNumber: '0301 6800786',
    email: 'bilal@example.com',
    streetAddress: 'House 8, Al Shafi St',
    areaSector: 'Satellite Block D Town',
    city: 'Rawalpindi',
    mapsLink: '',
  });
  assert.deepEqual(goodCustomer, {});

  assert.ok(
    validateAppointmentStep({
      preferredDate: '',
      preferredTime: '',
      propertyType: 'House',
      serviceLocation: '',
      additionalInstructions: '',
    }).preferredDate
  );

  assert.ok(
    validateJobDetailsStep({
      problemDescription: 'short',
      attachmentDataUrls: [],
      attachmentNames: [],
    }).problemDescription
  );
});

test('generateBookingReference and computeAdminAnalytics produce deterministic aggregates', () => {
  assert.equal(generateBookingReference(new Date('2026-05-01T10:00:00Z'), 42), 'KF-2026-0042');

  const bookings: BookingRecord[] = [
    {
      id: 'b1',
      referenceCode: 'KF-2026-1001',
      createdAt: '2026-10-15T10:00:00.000Z',
      status: 'Completed',
      items: addItemToCart([], fanService, 'Electrical Services', 2),
      customer: {
        fullName: 'Tariq Mahmood',
        mobileNumber: '03001112233',
        email: '',
        streetAddress: 'House 5',
        areaSector: 'Satellite Town',
        city: 'Rawalpindi',
        mapsLink: '',
      },
      appointment: {
        preferredDate: '2026-10-16',
        preferredTime: '10:00 AM - 12:00 PM',
        propertyType: 'House',
        serviceLocation: 'Rawalpindi',
        additionalInstructions: '',
      },
      jobDetails: {
        problemDescription: 'Install 2 ceiling fans',
        attachmentDataUrls: [],
        attachmentNames: [],
      },
      quotedTotalPkr: 4000,
      adminNotes: '',
    },
    {
      id: 'b2',
      referenceCode: 'KF-2026-1002',
      createdAt: '2026-11-02T12:00:00.000Z',
      status: 'New Request',
      items: addItemToCart([], tapService, 'Plumbing Services', 1),
      customer: {
        fullName: 'Sanaullah Khan',
        mobileNumber: '03215556677',
        email: '',
        streetAddress: 'Flat 3',
        areaSector: 'Chaklala Scheme III',
        city: 'Rawalpindi',
        mapsLink: '',
      },
      appointment: {
        preferredDate: '2026-11-03',
        preferredTime: '02:00 PM - 04:00 PM',
        propertyType: 'Apartment',
        serviceLocation: 'Rawalpindi',
        additionalInstructions: '',
      },
      jobDetails: {
        problemDescription: 'Leaking kitchen tap',
        attachmentDataUrls: [],
        attachmentNames: [],
      },
      quotedTotalPkr: null,
      adminNotes: '',
    },
  ];

  const analytics = computeAdminAnalytics(bookings, SERVICE_CATEGORIES);
  assert.equal(analytics.totalBookings, 2);
  assert.equal(analytics.completedBookings, 1);
  assert.equal(analytics.newRequests, 1);
  assert.equal(analytics.totalConfirmedRevenuePkr, 4000);
  assert.equal(analytics.quotePendingCount, 1);
  assert.equal(analytics.monthlyTrends.length, 2);
});
