import type { FaqEntry, ProjectPortfolioItem } from '../types/kaamfix';

export const BUSINESS_INFO = {
  name: 'KAAM FIX',
  tagline: 'Har Kaam, Ek Fix.',
  secondaryTagline: 'Ghar Ka Har Kaam, Asaan.',
  category: 'Home Builder, Home Maintenance, Home Repair and Construction Services',
  description:
    'Kaam Fix is a trusted home services platform providing reliable and professional services at your doorstep. We connect customers with skilled electricians, plumbers, carpenters, painters, and home repair professionals for everyday maintenance and improvement needs. From electrical and plumbing work to carpentry, painting, and general home repairs, Kaam Fix makes it easy to find the right professional for your job. Our focus is on quality workmanship, reliable service, transparent communication, and customer satisfaction.',
  address: 'Al Shafi St, Satellite Block D Town, Rawalpindi, 46300, Pakistan',
  shortAddress: 'Al Shafi St, Satellite Block D Town, Rawalpindi, 46300',
  city: 'Rawalpindi',
  phoneDisplay: '0301 6800786',
  phoneTel: '+923016800786',
  whatsappNumber: '923016800786',
  facebookUrl: 'https://www.facebook.com/kaamfix096/',
  hours: 'Saturday–Friday: 8:30 AM–10:00 PM',
  googleReviewsCount: 6,
  serviceLocationNote: 'Rawalpindi and nearby areas, subject to confirmation.',
  promises: [
    {
      title: 'Skilled Professionals',
      description:
        'Experienced electricians, plumbers, carpenters, painters, and masons you can trust in your home.',
    },
    {
      title: 'Reliable Service',
      description:
        'On-time visits and proper work from booking right through to the finish.',
    },
    {
      title: 'Transparent Pricing',
      description:
        'Clear prices agreed upfront with you before any work starts.',
    },
    {
      title: 'Doorstep Service',
      description:
        'Home, apartment, and shop visits across Rawalpindi.',
    },
  ],
} as const;

export const PORTFOLIO_ITEMS: ProjectPortfolioItem[] = [
  {
    id: 'sample-electrical-panel',
    title: 'Main Breaker Box & Wiring Cleanup',
    category: 'Electrical Work',
    locationLabel: 'Example Work · Rawalpindi',
    description:
      'Replaced faulty breakers, balanced room loads, and labeled the main distribution box so power trips stopped.',
    beforeSummary: 'Messy, unlabeled breaker box with loose wires that kept tripping.',
    afterSummary: 'Cleanly wired breaker box with clear labels for each room.',
    imageKey: 'service_electrical',
    isIllustrativeSample: true,
  },
  {
    id: 'sample-plumbing-vanity',
    title: 'Bathroom Sink & Mixer Tap Fitting',
    category: 'Plumbing Work',
    locationLabel: 'Example Work · Rawalpindi',
    description:
      'Installed a new bathroom basin, chrome mixer tap, waste trap, and leak-free water supply valves.',
    beforeSummary: 'Old dripping bathroom tap and leaking drain pipe under the sink.',
    afterSummary: 'New mixer tap, sealed drain connection, and dry cabinet underneath.',
    imageKey: 'service_plumbing',
    isIllustrativeSample: true,
  },
  {
    id: 'sample-carpentry-wardrobe',
    title: 'Kitchen Cabinets & Room Door Repair',
    category: 'Carpentry',
    locationLabel: 'Example Work · Rawalpindi',
    description:
      'Adjusted crooked kitchen cabinet shutters, fitted soft-close hinges, and planed a sticking bedroom door.',
    beforeSummary: 'Hanging cabinet doors, broken hinges, and a door that scraped the floor.',
    afterSummary: 'Straight cabinets with smooth hinges and a door that closes quietly.',
    imageKey: 'service_carpentry',
    isIllustrativeSample: true,
  },
  {
    id: 'sample-painting-interior',
    title: 'Full Room Wall Prep & Painting',
    category: 'Painting',
    locationLabel: 'Example Work · Rawalpindi',
    description:
      'Filled wall cracks, smoothed putty, applied primer, and finished with two clean coats of washable paint.',
    beforeSummary: 'Scuffed walls with small cracks and uneven paint patches.',
    afterSummary: 'Smooth, even walls with neat trim lines and clean floors.',
    imageKey: 'service_painting',
    isIllustrativeSample: true,
  },
  {
    id: 'sample-civil-tiling',
    title: 'Porcelain Floor Tile Fitting',
    category: 'Civil Work',
    locationLabel: 'Example Work · Rawalpindi',
    description:
      'Leveled the floor base and laid large porcelain tiles with even gaps and sealed grout.',
    beforeSummary: 'Uneven floor with cracked old tiles and loose mortar.',
    afterSummary: 'Flat, neatly spaced floor tiles with clean waterproof grouting.',
    imageKey: 'service_civil_work',
    isIllustrativeSample: true,
  },
  {
    id: 'sample-kitchen-renovation',
    title: 'Modern Kitchen Upgrade',
    category: 'Renovation',
    locationLabel: 'Example Work · Rawalpindi',
    description:
      'Updated the kitchen with new lighting, sink plumbing, oak cabinets, and countertops handled by one team.',
    beforeSummary: 'Old, dark kitchen with worn counters and poor lighting.',
    afterSummary: 'Bright kitchen with new wooden cabinets, counters, and LED lighting.',
    imageKey: 'service_renovation',
    isIllustrativeSample: true,
  },
];

export const FAQ_ITEMS: FaqEntry[] = [
  {
    id: 'services-provided',
    question: 'What services does KAAM FIX provide?',
    answer:
      'We handle electrical work, plumbing, carpentry, painting, civil & tile work, everyday home repairs, and renovations for homes, apartments, and shops.',
  },
  {
    id: 'multiple-services',
    question: 'Can I book multiple services together?',
    answer:
      'Yes. You can add different jobs—such as fitting a ceiling fan, fixing a leaking tap, and repairing a door—into one cart and send them together in a single booking.',
  },
  {
    id: 'add-to-cart',
    question: 'How do I add services to my cart?',
    answer:
      'Go to All Services or pick any category, then click "Add to Cart" on the jobs you need. Your cart saves automatically while you keep browsing.',
  },
  {
    id: 'request-quotation',
    question: 'How do I get a price quote?',
    answer:
      'Add the jobs you need to your cart and submit the booking form—or click "Send Cart to WhatsApp" to message your list to 0301 6800786. We will review the work and share the price before starting.',
  },
  {
    id: 'doorstep-service',
    question: 'Do you come to my home?',
    answer:
      'Yes. KAAM FIX sends workers directly to houses, apartments, offices, and shops across Rawalpindi and nearby areas (confirmed on call).',
  },
  {
    id: 'preferred-time',
    question: 'Can I choose my preferred date and time?',
    answer:
      'Yes. When booking, you can pick the day and time window that suits you between 8:30 AM and 10:00 PM (Saturday–Friday). Our team will call to confirm the slot.',
  },
  {
    id: 'contact-kaamfix',
    question: 'How can I contact KAAM FIX?',
    answer:
      'Call us on 0301 6800786, message us on WhatsApp (+92 301 6800786), fill out the Contact Us form, or visit our office at Al Shafi St, Satellite Block D Town, Rawalpindi.',
  },
  {
    id: 'areas-covered',
    question: 'Which areas do you cover?',
    answer:
      'We are based in Satellite Block D Town, Rawalpindi (46300) and serve Rawalpindi and nearby areas, subject to confirmation. You can check your area on our Service Areas page or call 0301 6800786.',
  },
  {
    id: 'fixed-prices',
    question: 'Are service prices fixed?',
    answer:
      'Some jobs have a fixed rate or starting price, while others say "Price on Request" because the work needs to be checked first. Either way, we tell you the exact cost before starting.',
  },
  {
    id: 'upload-pictures',
    question: 'Can I upload photos of what needs fixing?',
    answer:
      'Yes. On Step 4 of the booking form, you can attach photos of broken taps, leaks, wiring, walls, or rooms so our worker knows what tools to bring.',
  },
  {
    id: 'change-booking',
    question: 'How can I change or cancel my booking?',
    answer:
      'If you need to change your time, address, or service list after booking, just call 0301 6800786 or message us on WhatsApp with your booking reference number.',
  },
];
