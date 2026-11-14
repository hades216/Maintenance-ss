import dotenv from 'dotenv';
import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildSessionCookie,
  createSessionToken,
  isAdminRequestAuthenticated,
  verifyPassword,
} from './server/auth';
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
} from './server/store';
import {
  computeAdminAnalytics,
  validateAppointmentStep,
  validateCustomerStep,
  validateJobDetailsStep,
} from './src/utils/bookingLogic';
import type {
  BookingAppointmentDetails,
  BookingCustomerInfo,
  BookingJobDetails,
  CartItem,
  ServiceCategorySlug,
} from './src/types/kaamfix';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminRequestAuthenticated(req.headers.cookie)) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

export function createApp() {
  const app = express();
  app.use(express.json({ limit: '6mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'KAAM FIX' });
  });

  app.get('/api/bootstrap', async (_req, res) => {
    const db = await readDatabase();
    res.json({
      categories: db.categories,
      services: db.services,
      projects: db.projects,
      reviews: db.reviews,
      settings: db.settings,
    });
  });

  app.get('/api/services', async (_req, res) => {
    const db = await readDatabase();
    res.json({
      categories: db.categories,
      services: db.services,
    });
  });

  app.post('/api/bookings', async (req, res) => {
    try {
      const db = await readDatabase();
      if (!db.settings.bookingAvailable) {
        res.status(503).json({
          error:
            'Online booking is temporarily paused by KAAM FIX. Please call 0301 6800786 directly.',
        });
        return;
      }

      const body = req.body as {
        items?: CartItem[];
        customer?: BookingCustomerInfo;
        appointment?: BookingAppointmentDetails;
        jobDetails?: BookingJobDetails;
      };

      if (!Array.isArray(body.items) || body.items.length === 0) {
        res.status(400).json({ error: 'Please select at least one service before submitting.' });
        return;
      }

      if (!body.customer || !body.appointment || !body.jobDetails) {
        res.status(400).json({ error: 'Missing required booking sections.' });
        return;
      }

      const customerErrors = validateCustomerStep(body.customer);
      const appointmentErrors = validateAppointmentStep(body.appointment);
      const jobErrors = validateJobDetailsStep(body.jobDetails);
      const combinedErrors = { ...customerErrors, ...appointmentErrors, ...jobErrors };

      if (Object.keys(combinedErrors).length > 0) {
        res.status(400).json({ error: 'Validation failed', fieldErrors: combinedErrors });
        return;
      }

      const safeAttachments = Array.isArray(body.jobDetails.attachmentDataUrls)
        ? body.jobDetails.attachmentDataUrls.slice(0, 4)
        : [];
      const safeAttachmentNames = Array.isArray(body.jobDetails.attachmentNames)
        ? body.jobDetails.attachmentNames.slice(0, 4)
        : [];

      const created = await createBooking({
        items: body.items,
        customer: body.customer,
        appointment: body.appointment,
        jobDetails: {
          problemDescription: body.jobDetails.problemDescription.trim(),
          attachmentDataUrls: safeAttachments,
          attachmentNames: safeAttachmentNames,
        },
      });

      res.status(201).json({ booking: created });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to save booking request.',
      });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const { name, phone, address, serviceCategory, message } = req.body as {
        name?: string;
        phone?: string;
        address?: string;
        serviceCategory?: string;
        message?: string;
      };

      if (!name?.trim() || !phone?.trim() || !message?.trim()) {
        res.status(400).json({ error: 'Name, phone number, and message are required.' });
        return;
      }

      const inquiry = await createContactInquiry({
        name,
        phone,
        address: address || '',
        serviceCategory: serviceCategory || 'General Inquiry',
        message,
      });

      res.status(201).json({ inquiry });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to submit contact inquiry.',
      });
    }
  });

  // Admin Authentication
  app.get('/api/admin/session', (req, res) => {
    res.json({ authenticated: isAdminRequestAuthenticated(req.headers.cookie) });
  });

  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body as { password?: string };
    if (typeof password !== 'string' || !password.trim()) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    if (!verifyPassword(password)) {
      res.status(401).json({ error: 'Invalid admin password.' });
      return;
    }

    const token = createSessionToken();
    res.setHeader('Set-Cookie', buildSessionCookie(token, false));
    res.json({ authenticated: true });
  });

  app.post('/api/admin/logout', (_req, res) => {
    res.setHeader('Set-Cookie', buildSessionCookie('', true));
    res.json({ authenticated: false });
  });

  // Admin Dashboard Data & Mutations
  app.get('/api/admin/dashboard', requireAdmin, async (_req, res) => {
    const db = await readDatabase();
    const analytics = computeAdminAnalytics(db.bookings, db.categories);
    res.json({
      bookings: db.bookings,
      inquiries: db.inquiries,
      categories: db.categories,
      services: db.services,
      projects: db.projects,
      reviews: db.reviews,
      settings: db.settings,
      analytics,
    });
  });

  app.patch('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
    const updated = await updateBookingAdmin(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }
    const db = await readDatabase();
    res.json({
      booking: updated,
      analytics: computeAdminAnalytics(db.bookings, db.categories),
    });
  });

  app.patch('/api/admin/categories/:slug', requireAdmin, async (req, res) => {
    const updated = await updateCategoryAdmin(req.params.slug as ServiceCategorySlug, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ category: updated });
  });

  app.patch('/api/admin/services/:id', requireAdmin, async (req, res) => {
    const updated = await updateServiceAdmin(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Service not found.' });
      return;
    }
    res.json({ service: updated });
  });

  app.post('/api/admin/services', requireAdmin, async (req, res) => {
    const body = req.body;
    if (!body?.name || !body?.categorySlug || !body?.shortDescription) {
      res.status(400).json({ error: 'Service name, category, and description are required.' });
      return;
    }
    const created = await addServiceAdmin({
      categorySlug: body.categorySlug,
      name: String(body.name).trim(),
      shortDescription: String(body.shortDescription).trim(),
      detailedDescription: String(body.detailedDescription || body.shortDescription).trim(),
      imageKey: body.imageKey || 'service_maintenance',
      customImageUrl: body.customImageUrl ? String(body.customImageUrl).trim() : undefined,
      pricingType: body.pricingType || 'quote',
      pricePkr: typeof body.pricePkr === 'number' ? body.pricePkr : null,
      unitLabel: String(body.unitLabel || 'per job').trim(),
      available: body.available !== false,
    });
    res.status(201).json({ service: created });
  });

  app.delete('/api/admin/services/:id', requireAdmin, async (req, res) => {
    const deleted = await deleteServiceAdmin(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Service not found.' });
      return;
    }
    res.json({ deleted: true });
  });

  app.post('/api/admin/projects', requireAdmin, async (req, res) => {
    const body = req.body;
    if (!body?.title || !body?.category || !body?.description) {
      res.status(400).json({ error: 'Project title, category, and description are required.' });
      return;
    }
    const created = await addProjectAdmin({
      title: String(body.title).trim(),
      category: body.category,
      locationLabel: String(body.locationLabel || 'Rawalpindi').trim(),
      description: String(body.description).trim(),
      beforeSummary: String(body.beforeSummary || 'Initial site condition').trim(),
      afterSummary: String(body.afterSummary || 'Completed KAAM FIX workmanship').trim(),
      imageKey: body.imageKey || 'service_renovation',
      customImageUrl: body.customImageUrl ? String(body.customImageUrl).trim() : undefined,
      isIllustrativeSample: Boolean(body.isIllustrativeSample),
    });
    res.status(201).json({ project: created });
  });

  app.delete('/api/admin/projects/:id', requireAdmin, async (req, res) => {
    const deleted = await deleteProjectAdmin(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    res.json({ deleted: true });
  });

  app.post('/api/admin/reviews', requireAdmin, async (req, res) => {
    const body = req.body;
    if (!body?.reviewerName || !body?.comment) {
      res.status(400).json({ error: 'Reviewer name and verified comment are required.' });
      return;
    }
    const rating = Math.min(5, Math.max(1, Number(body.rating || 5)));
    const created = await addReviewAdmin({
      reviewerName: String(body.reviewerName).trim(),
      rating,
      comment: String(body.comment).trim(),
      serviceType: String(body.serviceType || 'Home Services').trim(),
      dateLabel: String(body.dateLabel || new Date().toLocaleDateString('en-PK')).trim(),
      source: body.source === 'Google' ? 'Google' : 'Direct',
    });
    res.status(201).json({ review: created });
  });

  app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
    const deleted = await deleteReviewAdmin(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Review not found.' });
      return;
    }
    res.json({ deleted: true });
  });

  app.patch('/api/admin/settings', requireAdmin, async (req, res) => {
    const settings = await updateSettingsAdmin(req.body);
    res.json({ settings });
  });

  return app;
}

async function startServer() {
  const app = createApp();
  const port = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`KAAM FIX server listening on http://localhost:${port}`);
  });
}

startServer();
