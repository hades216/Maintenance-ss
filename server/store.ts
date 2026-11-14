import fs from 'node:fs/promises';
import path from 'node:path';
import { BUSINESS_INFO, PORTFOLIO_ITEMS } from '../src/data/business';
import { INITIAL_SERVICES, SERVICE_CATEGORIES } from '../src/data/catalog';
import type {
  BookingRecord,
  BookingStatus,
  ContactInquiry,
  EditableBusinessSettings,
  PricingType,
  ProjectPortfolioItem,
  ServiceCategory,
  ServiceCategorySlug,
  ServiceItem,
  VerifiedReview,
} from '../src/types/kaamfix';
import { generateBookingReference } from '../src/utils/bookingLogic';

export interface KaamFixDatabase {
  categories: ServiceCategory[];
  services: ServiceItem[];
  bookings: BookingRecord[];
  inquiries: ContactInquiry[];
  projects: ProjectPortfolioItem[];
  reviews: VerifiedReview[];
  settings: EditableBusinessSettings;
}

function resolveDbPath(): string {
  if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return '/tmp/kaamfix-db.json';
  }
  return path.join(process.cwd(), 'data', 'kaamfix-db.json');
}

let memoryFallback: KaamFixDatabase | null = null;

function createInitialDb(): KaamFixDatabase {
  return {
    categories: SERVICE_CATEGORIES.map((c) => ({ ...c, highlights: [...c.highlights] })),
    services: INITIAL_SERVICES.map((s) => ({ ...s })),
    bookings: [],
    inquiries: [],
    projects: PORTFOLIO_ITEMS.map((p) => ({ ...p })),
    reviews: [],
    settings: {
      phoneDisplay: BUSINESS_INFO.phoneDisplay,
      whatsappNumber: BUSINESS_INFO.whatsappNumber,
      address: BUSINESS_INFO.address,
      hours: BUSINESS_INFO.hours,
      facebookUrl: BUSINESS_INFO.facebookUrl,
      serviceLocationNote: BUSINESS_INFO.serviceLocationNote,
      bookingAvailable: true,
      confirmedAreas: ['Satellite Town (Block A–F, Rawalpindi)'],
    },
  };
}

export async function readDatabase(): Promise<KaamFixDatabase> {
  const dbPath = resolveDbPath();
  const defaults = createInitialDb();
  try {
    const raw = await fs.readFile(dbPath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<KaamFixDatabase>;
    const db: KaamFixDatabase = {
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length > 0
          ? parsed.categories
          : defaults.categories,
      services:
        Array.isArray(parsed.services) && parsed.services.length > 0
          ? parsed.services
          : defaults.services,
      bookings: Array.isArray(parsed.bookings) ? parsed.bookings : [],
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      projects:
        Array.isArray(parsed.projects) && parsed.projects.length > 0
          ? parsed.projects
          : defaults.projects,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      settings: parsed.settings
        ? { ...defaults.settings, ...parsed.settings }
        : defaults.settings,
    };
    memoryFallback = db;
    return db;
  } catch {
    if (memoryFallback) return memoryFallback;
    await writeDatabase(defaults);
    return defaults;
  }
}

export async function writeDatabase(db: KaamFixDatabase): Promise<void> {
  memoryFallback = db;
  const dbPath = resolveDbPath();
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    // Keep memoryFallback when filesystem is ephemeral
  }
}

export async function createBooking(
  payload: Omit<
    BookingRecord,
    'id' | 'referenceCode' | 'createdAt' | 'status' | 'quotedTotalPkr' | 'adminNotes'
  >
): Promise<BookingRecord> {
  const db = await readDatabase();
  const now = new Date();
  let referenceCode = generateBookingReference(now);
  while (db.bookings.some((b) => b.referenceCode === referenceCode)) {
    referenceCode = generateBookingReference(now);
  }

  const allFixed =
    payload.items.length > 0 &&
    payload.items.every(
      (item) =>
        item.pricingType === 'fixed' &&
        typeof item.pricePkr === 'number' &&
        item.pricePkr > 0
    );
  const fixedSum = allFixed
    ? payload.items.reduce((sum, item) => sum + (item.pricePkr ?? 0) * item.quantity, 0)
    : null;

  const record: BookingRecord = {
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    referenceCode,
    createdAt: now.toISOString(),
    status: 'New Request',
    items: payload.items,
    customer: payload.customer,
    appointment: payload.appointment,
    jobDetails: payload.jobDetails,
    quotedTotalPkr: fixedSum,
    adminNotes: '',
  };

  db.bookings.unshift(record);
  await writeDatabase(db);
  return record;
}

export async function updateBookingAdmin(
  id: string,
  updates: { status?: BookingStatus; quotedTotalPkr?: number | null; adminNotes?: string }
): Promise<BookingRecord | null> {
  const db = await readDatabase();
  const idx = db.bookings.findIndex((b) => b.id === id);
  if (idx < 0) return null;

  const current = db.bookings[idx];
  const updated: BookingRecord = {
    ...current,
    status: updates.status ?? current.status,
    quotedTotalPkr:
      updates.quotedTotalPkr !== undefined ? updates.quotedTotalPkr : current.quotedTotalPkr,
    adminNotes: updates.adminNotes !== undefined ? updates.adminNotes : current.adminNotes,
  };

  db.bookings[idx] = updated;
  await writeDatabase(db);
  return updated;
}

export async function updateCategoryAdmin(
  slug: ServiceCategorySlug,
  updates: { name?: string; tagline?: string; description?: string }
): Promise<ServiceCategory | null> {
  const db = await readDatabase();
  const idx = db.categories.findIndex((c) => c.slug === slug);
  if (idx < 0) return null;
  const current = db.categories[idx];
  const updated: ServiceCategory = {
    ...current,
    name: updates.name?.trim() || current.name,
    tagline: updates.tagline?.trim() || current.tagline,
    description: updates.description?.trim() || current.description,
  };
  db.categories[idx] = updated;
  await writeDatabase(db);
  return updated;
}

export async function updateServiceAdmin(
  id: string,
  updates: {
    pricingType?: PricingType;
    pricePkr?: number | null;
    available?: boolean;
    name?: string;
    shortDescription?: string;
    detailedDescription?: string;
    imageKey?: ServiceItem['imageKey'];
    customImageUrl?: string;
  }
): Promise<ServiceItem | null> {
  const db = await readDatabase();
  const idx = db.services.findIndex((s) => s.id === id);
  if (idx < 0) return null;

  const current = db.services[idx];
  const updated: ServiceItem = {
    ...current,
    pricingType: updates.pricingType ?? current.pricingType,
    pricePkr: updates.pricePkr !== undefined ? updates.pricePkr : current.pricePkr,
    available: updates.available !== undefined ? updates.available : current.available,
    name: updates.name !== undefined && updates.name.trim() ? updates.name.trim() : current.name,
    shortDescription:
      updates.shortDescription !== undefined && updates.shortDescription.trim()
        ? updates.shortDescription.trim()
        : current.shortDescription,
    detailedDescription:
      updates.detailedDescription !== undefined && updates.detailedDescription.trim()
        ? updates.detailedDescription.trim()
        : current.detailedDescription,
    imageKey: updates.imageKey ?? current.imageKey,
    customImageUrl:
      updates.customImageUrl !== undefined ? updates.customImageUrl : current.customImageUrl,
  };

  db.services[idx] = updated;
  await writeDatabase(db);
  return updated;
}

export async function addServiceAdmin(
  service: Omit<ServiceItem, 'id' | 'slug'>
): Promise<ServiceItem> {
  const db = await readDatabase();
  const slugBase = service.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const id = `${service.categorySlug}-${slugBase}-${Date.now().toString(36).slice(-4)}`;

  const created: ServiceItem = {
    ...service,
    id,
    slug: slugBase || id,
  };

  db.services.push(created);
  await writeDatabase(db);
  return created;
}

export async function deleteServiceAdmin(id: string): Promise<boolean> {
  const db = await readDatabase();
  const before = db.services.length;
  db.services = db.services.filter((s) => s.id !== id);
  if (db.services.length === before) return false;
  await writeDatabase(db);
  return true;
}

export async function addProjectAdmin(
  project: Omit<ProjectPortfolioItem, 'id'>
): Promise<ProjectPortfolioItem> {
  const db = await readDatabase();
  const created: ProjectPortfolioItem = {
    ...project,
    id: `proj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  };
  db.projects.unshift(created);
  await writeDatabase(db);
  return created;
}

export async function deleteProjectAdmin(id: string): Promise<boolean> {
  const db = await readDatabase();
  const before = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length === before) return false;
  await writeDatabase(db);
  return true;
}

export async function addReviewAdmin(
  review: Omit<VerifiedReview, 'id'>
): Promise<VerifiedReview> {
  const db = await readDatabase();
  const created: VerifiedReview = {
    ...review,
    id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  };
  db.reviews.unshift(created);
  await writeDatabase(db);
  return created;
}

export async function deleteReviewAdmin(id: string): Promise<boolean> {
  const db = await readDatabase();
  const before = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  if (db.reviews.length === before) return false;
  await writeDatabase(db);
  return true;
}

export async function updateSettingsAdmin(
  updates: Partial<EditableBusinessSettings>
): Promise<EditableBusinessSettings> {
  const db = await readDatabase();
  db.settings = {
    ...db.settings,
    ...updates,
    confirmedAreas: Array.isArray(updates.confirmedAreas)
      ? updates.confirmedAreas
      : db.settings.confirmedAreas,
  };
  await writeDatabase(db);
  return db.settings;
}

export async function createContactInquiry(
  payload: Omit<ContactInquiry, 'id' | 'createdAt' | 'status'>
): Promise<ContactInquiry> {
  const db = await readDatabase();
  const inquiry: ContactInquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    address: payload.address.trim(),
    serviceCategory: payload.serviceCategory.trim(),
    message: payload.message.trim(),
    status: 'New',
  };
  db.inquiries.unshift(inquiry);
  await writeDatabase(db);
  return inquiry;
}
