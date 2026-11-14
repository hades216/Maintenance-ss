import {
  buildSessionCookie,
  createSessionToken,
  isAdminRequestAuthenticated,
  verifyPassword,
} from '../../server/auth';
import {
  addProjectAdmin,
  addReviewAdmin,
  addServiceAdmin,
  createBooking,
  createContactInquiry,
  deleteProjectAdmin,
  deleteReviewAdmin,
  deleteServiceAdmin,
  readDatabase,
  updateBookingAdmin,
  updateCategoryAdmin,
  updateServiceAdmin,
  updateSettingsAdmin,
} from '../../server/store';
import {
  computeAdminAnalytics,
  validateAppointmentStep,
  validateCustomerStep,
  validateJobDetailsStep,
} from '../../src/utils/bookingLogic';

function jsonResponse(data: unknown, status = 200, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const rawPath = url.pathname
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');
  const route = rawPath || '/';
  const method = req.method.toUpperCase();
  const cookieHeader = req.headers.get('cookie') ?? undefined;

  if (route === '/health' && method === 'GET') {
    return jsonResponse({ ok: true, service: 'KAAM FIX' });
  }

  if (route === '/bootstrap' && method === 'GET') {
    const db = await readDatabase();
    return jsonResponse({
      categories: db.categories,
      services: db.services,
      projects: db.projects,
      reviews: db.reviews,
      settings: db.settings,
    });
  }

  if (route === '/services' && method === 'GET') {
    const db = await readDatabase();
    return jsonResponse({ categories: db.categories, services: db.services });
  }

  if (route === '/bookings' && method === 'POST') {
    const db = await readDatabase();
    if (!db.settings.bookingAvailable) {
      return jsonResponse(
        {
          error:
            'Online booking is temporarily paused by KAAM FIX. Please call 0301 6800786 directly.',
        },
        503
      );
    }

    const body = (await req.json()) as Record<string, unknown>;
    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0 || !body.customer || !body.appointment || !body.jobDetails) {
      return jsonResponse({ error: 'Incomplete booking request.' }, 400);
    }

    const errors = {
      ...validateCustomerStep(body.customer as never),
      ...validateAppointmentStep(body.appointment as never),
      ...validateJobDetailsStep(body.jobDetails as never),
    };
    if (Object.keys(errors).length > 0) {
      return jsonResponse({ error: 'Validation failed', fieldErrors: errors }, 400);
    }

    const created = await createBooking({
      items: items as never,
      customer: body.customer as never,
      appointment: body.appointment as never,
      jobDetails: body.jobDetails as never,
    });
    return jsonResponse({ booking: created }, 201);
  }

  if (route === '/contact' && method === 'POST') {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      address?: string;
      serviceCategory?: string;
      message?: string;
    };
    if (!body.name?.trim() || !body.phone?.trim() || !body.message?.trim()) {
      return jsonResponse({ error: 'Name, phone number, and message are required.' }, 400);
    }
    const inquiry = await createContactInquiry({
      name: body.name,
      phone: body.phone,
      address: body.address || '',
      serviceCategory: body.serviceCategory || 'General Inquiry',
      message: body.message,
    });
    return jsonResponse({ inquiry }, 201);
  }

  if (route === '/admin/session' && method === 'GET') {
    return jsonResponse({ authenticated: isAdminRequestAuthenticated(cookieHeader) });
  }

  if (route === '/admin/login' && method === 'POST') {
    const body = (await req.json()) as { password?: string };
    if (!body.password || !verifyPassword(body.password)) {
      return jsonResponse({ error: 'Invalid admin password.' }, 401);
    }
    const token = createSessionToken();
    return jsonResponse(
      { authenticated: true },
      200,
      { 'Set-Cookie': buildSessionCookie(token, false) }
    );
  }

  if (route === '/admin/logout' && method === 'POST') {
    return jsonResponse(
      { authenticated: false },
      200,
      { 'Set-Cookie': buildSessionCookie('', true) }
    );
  }

  if (!isAdminRequestAuthenticated(cookieHeader)) {
    return jsonResponse({ error: 'Authentication required' }, 401);
  }

  if (route === '/admin/dashboard' && method === 'GET') {
    const db = await readDatabase();
    return jsonResponse({
      bookings: db.bookings,
      inquiries: db.inquiries,
      categories: db.categories,
      services: db.services,
      projects: db.projects,
      reviews: db.reviews,
      settings: db.settings,
      analytics: computeAdminAnalytics(db.bookings, db.categories),
    });
  }

  const bookingMatch = route.match(/^\/admin\/bookings\/([^/]+)$/);
  if (bookingMatch && method === 'PATCH') {
    const body = await req.json();
    const updated = await updateBookingAdmin(bookingMatch[1], body as never);
    if (!updated) return jsonResponse({ error: 'Booking not found.' }, 404);
    const db = await readDatabase();
    return jsonResponse({
      booking: updated,
      analytics: computeAdminAnalytics(db.bookings, db.categories),
    });
  }

  const categoryMatch = route.match(/^\/admin\/categories\/([^/]+)$/);
  if (categoryMatch && method === 'PATCH') {
    const body = await req.json();
    const updated = await updateCategoryAdmin(categoryMatch[1] as never, body as never);
    if (!updated) return jsonResponse({ error: 'Category not found.' }, 404);
    return jsonResponse({ category: updated });
  }

  if (route === '/admin/services' && method === 'POST') {
    const body = (await req.json()) as Record<string, unknown>;
    if (!body.name || !body.categorySlug || !body.shortDescription) {
      return jsonResponse({ error: 'Missing required service fields.' }, 400);
    }
    const created = await addServiceAdmin({
      categorySlug: body.categorySlug as never,
      name: String(body.name).trim(),
      shortDescription: String(body.shortDescription).trim(),
      detailedDescription: String(body.detailedDescription || body.shortDescription).trim(),
      imageKey: (body.imageKey as never) || 'service_maintenance',
      customImageUrl: body.customImageUrl ? String(body.customImageUrl).trim() : undefined,
      pricingType: (body.pricingType as never) || 'quote',
      pricePkr: typeof body.pricePkr === 'number' ? body.pricePkr : null,
      unitLabel: String(body.unitLabel || 'per job').trim(),
      available: body.available !== false,
    });
    return jsonResponse({ service: created }, 201);
  }

  const serviceMatch = route.match(/^\/admin\/services\/([^/]+)$/);
  if (serviceMatch && method === 'PATCH') {
    const body = await req.json();
    const updated = await updateServiceAdmin(serviceMatch[1], body as never);
    if (!updated) return jsonResponse({ error: 'Service not found.' }, 404);
    return jsonResponse({ service: updated });
  }

  if (serviceMatch && method === 'DELETE') {
    const deleted = await deleteServiceAdmin(serviceMatch[1]);
    if (!deleted) return jsonResponse({ error: 'Service not found.' }, 404);
    return jsonResponse({ deleted: true });
  }

  if (route === '/admin/projects' && method === 'POST') {
    const body = (await req.json()) as Record<string, unknown>;
    if (!body.title || !body.category || !body.description) {
      return jsonResponse({ error: 'Project title, category, and description are required.' }, 400);
    }
    const created = await addProjectAdmin({
      title: String(body.title).trim(),
      category: body.category as never,
      locationLabel: String(body.locationLabel || 'Rawalpindi').trim(),
      description: String(body.description).trim(),
      beforeSummary: String(body.beforeSummary || 'Initial site condition').trim(),
      afterSummary: String(body.afterSummary || 'Completed KAAM FIX workmanship').trim(),
      imageKey: (body.imageKey as never) || 'service_renovation',
      customImageUrl: body.customImageUrl ? String(body.customImageUrl).trim() : undefined,
      isIllustrativeSample: Boolean(body.isIllustrativeSample),
    });
    return jsonResponse({ project: created }, 201);
  }

  const projectMatch = route.match(/^\/admin\/projects\/([^/]+)$/);
  if (projectMatch && method === 'DELETE') {
    const deleted = await deleteProjectAdmin(projectMatch[1]);
    if (!deleted) return jsonResponse({ error: 'Project not found.' }, 404);
    return jsonResponse({ deleted: true });
  }

  if (route === '/admin/reviews' && method === 'POST') {
    const body = (await req.json()) as Record<string, unknown>;
    if (!body.reviewerName || !body.comment) {
      return jsonResponse({ error: 'Reviewer name and verified comment are required.' }, 400);
    }
    const created = await addReviewAdmin({
      reviewerName: String(body.reviewerName).trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating || 5))),
      comment: String(body.comment).trim(),
      serviceType: String(body.serviceType || 'Home Services').trim(),
      dateLabel: String(body.dateLabel || new Date().toLocaleDateString('en-PK')).trim(),
      source: body.source === 'Google' ? 'Google' : 'Direct',
    });
    return jsonResponse({ review: created }, 201);
  }

  const reviewMatch = route.match(/^\/admin\/reviews\/([^/]+)$/);
  if (reviewMatch && method === 'DELETE') {
    const deleted = await deleteReviewAdmin(reviewMatch[1]);
    if (!deleted) return jsonResponse({ error: 'Review not found.' }, 404);
    return jsonResponse({ deleted: true });
  }

  if (route === '/admin/settings' && method === 'PATCH') {
    const body = await req.json();
    const settings = await updateSettingsAdmin(body as never);
    return jsonResponse({ settings });
  }

  return jsonResponse({ error: 'Not found' }, 404);
}
