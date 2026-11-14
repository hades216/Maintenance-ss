export type PricingType = 'fixed' | 'starting' | 'quote';

export type ServiceCategorySlug =
  | 'electrical'
  | 'plumbing'
  | 'carpentry'
  | 'painting'
  | 'civil-work'
  | 'home-maintenance'
  | 'renovation';

export type ImageKey =
  | 'hero_electrician'
  | 'hero_plumber'
  | 'hero_renovation'
  | 'service_electrical'
  | 'service_plumbing'
  | 'service_carpentry'
  | 'service_painting'
  | 'service_civil_work'
  | 'service_maintenance'
  | 'service_renovation'
  | 'intro_home_solution';

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  imageKey: ImageKey;
  highlights: string[];
}

export interface ServiceItem {
  id: string;
  slug: string;
  categorySlug: ServiceCategorySlug;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  imageKey: ImageKey;
  customImageUrl?: string;
  pricingType: PricingType;
  pricePkr: number | null;
  unitLabel: string;
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  serviceId: string;
  serviceName: string;
  categorySlug: ServiceCategorySlug;
  categoryName: string;
  imageKey: ImageKey;
  customImageUrl?: string;
  pricingType: PricingType;
  pricePkr: number | null;
  unitLabel: string;
  quantity: number;
  notes: string;
}

export type PropertyType =
  | 'House'
  | 'Apartment'
  | 'Office'
  | 'Commercial Property'
  | 'Other';

export interface BookingCustomerInfo {
  fullName: string;
  mobileNumber: string;
  email: string;
  streetAddress: string;
  areaSector: string;
  city: string;
  mapsLink: string;
}

export interface BookingAppointmentDetails {
  preferredDate: string;
  preferredTime: string;
  propertyType: PropertyType;
  serviceLocation: string;
  additionalInstructions: string;
}

export interface BookingJobDetails {
  problemDescription: string;
  attachmentDataUrls: string[];
  attachmentNames: string[];
}

export type BookingStatus =
  | 'New Request'
  | 'Contacted'
  | 'Quotation Sent'
  | 'Confirmed'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export interface BookingRecord {
  id: string;
  referenceCode: string;
  createdAt: string;
  status: BookingStatus;
  items: CartItem[];
  customer: BookingCustomerInfo;
  appointment: BookingAppointmentDetails;
  jobDetails: BookingJobDetails;
  quotedTotalPkr: number | null;
  adminNotes: string;
}

export interface ContactInquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  address: string;
  serviceCategory: string;
  message: string;
  status: 'New' | 'Reviewed';
}

export interface ProjectPortfolioItem {
  id: string;
  title: string;
  category:
    | 'Electrical Work'
    | 'Plumbing Work'
    | 'Carpentry'
    | 'Painting'
    | 'Civil Work'
    | 'Renovation'
    | 'Construction';
  locationLabel: string;
  description: string;
  beforeSummary: string;
  afterSummary: string;
  imageKey: ImageKey;
  customImageUrl?: string;
  isIllustrativeSample: boolean;
}

export interface VerifiedReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  serviceType: string;
  dateLabel: string;
  source: 'Google' | 'Direct';
}

export interface EditableBusinessSettings {
  phoneDisplay: string;
  whatsappNumber: string;
  address: string;
  hours: string;
  facebookUrl: string;
  serviceLocationNote: string;
  bookingAvailable: boolean;
  confirmedAreas: string[];
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface AdminAnalytics {
  totalBookings: number;
  newRequests: number;
  activeBookings: number;
  completedBookings: number;
  totalConfirmedRevenuePkr: number;
  quotePendingCount: number;
  categoryCounts: { categoryName: string; count: number; revenuePkr: number }[];
  monthlyTrends: { month: string; bookings: number; revenuePkr: number }[];
}
