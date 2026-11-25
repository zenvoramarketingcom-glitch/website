export type ServiceId = 'websites' | 'meta-ads' | 'whatsapp' | 'businesses';

export interface ServiceItem {
  id: ServiceId;
  index: string;
  title: string;
  shortTitle: string;
  accentWord: string;
  summary: string;
  deliverables: string[];
  outcomeLine: string;
  ctaLabel: string;
  accentColor: string;
  surfaceTint: string;
}

export interface BusinessNiche {
  id: string;
  name: string;
  category: string;
  focus: string;
  recommendedStack: string[];
  sampleLeadGoal: string;
}

export interface SampleWebsite {
  id: string;
  businessName: string;
  industry: string;
  tagline: string;
  imageUrl?: string;
  accentHex: string;
  highlights: string[];
  sampleUrlLabel: string;
  previewSections: {
    heroTitle: string;
    heroSubtitle: string;
    metricsLabel: string;
    ctaText: string;
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface MapRegion {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
  baseDensityPerKm2: number;
}

export const FOUNDER_IMAGE = '/src/assets/images/founder_mangal_portrait_1795546841034.jpg';

export const SERVICES: ServiceItem[] = [
  {
    id: 'websites',
    index: '01',
    title: 'Custom Websites & Shopify Stores',
    shortTitle: 'Websites & Shopify',
    accentWord: 'High-Converting',
    summary:
      'Bespoke business websites, fast landing pages, and full Shopify e-commerce storefronts engineered for speed, mobile clarity, and direct checkout or lead capture.',
    deliverables: [
      'Custom React & Responsive Web Design',
      'Shopify Store Setup, Catalog & Payment Gateways',
      'Speed Optimization & Technical SEO Structure',
      'Direct Lead Forms & Booking Flows',
    ],
    outcomeLine: 'Built to turn visitors into enquiries and orders within seconds.',
    ctaLabel: 'Configure Website',
    accentColor: '#1D4ED8',
    surfaceTint: '#EFF6FF',
  },
  {
    id: 'meta-ads',
    index: '02',
    title: 'Meta Ads & Performance Growth',
    shortTitle: 'Meta Ads Growth',
    accentWord: 'Targeted',
    summary:
      'Precision Facebook & Instagram ad campaigns tailored for clothing brands, local clinics, real estate projects, and e-commerce stores—optimized for real sales and qualified leads.',
    deliverables: [
      'Sales, Leads, Traffic & Awareness Funnels',
      'Hyper-Local Pin & Radius Geo-Targeting',
      'Meta Pixel, Conversions API & Retargeting',
      'Creative Ad Copy & Carousel Strategy',
    ],
    outcomeLine: 'Reach buyers in your exact target area without wasted ad spend.',
    ctaLabel: 'Plan Meta Ads',
    accentColor: '#EA580C',
    surfaceTint: '#FFF7ED',
  },
  {
    id: 'whatsapp',
    index: '03',
    title: 'WhatsApp Automation & Lead CRM',
    shortTitle: 'WhatsApp Automation',
    accentWord: 'Instant',
    summary:
      'Automated WhatsApp Business replies, product catalog bots, appointment reminders, and abandoned-cart recovery flows so every enquiry gets an instant answer 24/7.',
    deliverables: [
      'Instant Lead Greeting & Qualification Bot',
      'Shopify Order & Abandoned Cart Alerts',
      'Clinic & Real Estate Visit Reminders',
      'Segmented Broadcast & Follow-Up Sequences',
    ],
    outcomeLine: 'Zero missed leads—auto-respond and book clients while you sleep.',
    ctaLabel: 'Setup Automation',
    accentColor: '#0F766E',
    surfaceTint: '#F0FDFA',
  },
  {
    id: 'businesses',
    index: '04',
    title: 'Industry Blueprints & Other Businesses',
    shortTitle: 'Other Businesses',
    accentWord: 'Tailored',
    summary:
      'Complete digital growth systems designed specifically for Real Estate, Dental Clinics, Solar Energy, Clothing Stores, Coaching Centers, Salons, and local enterprises.',
    deliverables: [
      'Niche-Specific Website & Landing Templates',
      'Local Discovery + Paid Ads Pairing',
      'Automated Follow-Up & Review Workflows',
      'Full Brand Launch from Domain to Leads',
    ],
    outcomeLine: 'Search your industry and launch a ready-to-scale digital system.',
    ctaLabel: 'Explore Industries',
    accentColor: '#4338CA',
    surfaceTint: '#EEF2FF',
  },
];

export const META_AD_GOALS = [
  { id: 'sales', label: 'Sales & E-Commerce Orders', desc: 'Catalog & conversion campaigns for online stores and clothing brands' },
  { id: 'leads', label: 'Qualified Leads & Bookings', desc: 'Instant forms and WhatsApp inquiries for clinics, real estate & solar' },
  { id: 'traffic', label: 'Website & Store Traffic', desc: 'High-intent visitors sent directly to your landing page or Shopify store' },
  { id: 'awareness', label: 'Local Brand Awareness', desc: 'Reach every potential customer within your city or neighborhood radius' },
];

export const META_AD_BUSINESSES = [
  'Clothing & Apparel Shop',
  'Real Estate & Property',
  'Dental & Healthcare Clinic',
  'Solar Energy & Rooftop',
  'E-Commerce & D2C Brand',
  'Gym & Fitness Studio',
  'Restaurant & Cafe',
  'Coaching & Education',
  'Salon & Beauty Studio',
  'Other Local Business',
];

export const BUDGET_TIERS = [
  'Starter (₹10,000 – ₹25,000 / mo)',
  'Growth (₹25,000 – ₹50,000 / mo)',
  'Scale (₹50,000 – ₹1,00,000 / mo)',
  'Enterprise (₹1,00,000+ / mo)',
  'Not decided yet — need guidance',
];

export const WEBSITE_TYPES = [
  { id: 'business-site', label: 'Custom Business Website', desc: 'Clean multi-section brand site with inquiry capture & WhatsApp integration' },
  { id: 'shopify-store', label: 'Shopify E-Commerce Store', desc: 'Full online store with Razorpay/UPI checkout, shipping & product variants' },
  { id: 'landing-page', label: 'High-Speed Ad Landing Page', desc: 'Focused single-page funnel engineered specifically for Meta & Google Ads' },
  { id: '3d-showcase', label: 'Interactive 3D Portfolio Site', desc: 'Scroll-driven modern spatial site to stand out in competitive markets' },
];

export const WEBSITE_FEATURES = [
  'UPI / Card Payment Gateway',
  'WhatsApp Chat & Lead Alerts',
  'Appointment Booking Calendar',
  'Product Catalog & Filters',
  'Meta Pixel & Analytics Tracking',
  'Technical SEO & Fast Load',
];

export const WHATSAPP_FLOWS = [
  { id: 'lead-qualify', label: 'Instant Lead Auto-Reply & Qualification', desc: 'Greet website & ad leads in 2 seconds and collect requirements automatically' },
  { id: 'catalog-bot', label: 'Product Catalog & Order Bot', desc: 'Let customers browse items and place orders inside WhatsApp' },
  { id: 'appointment', label: 'Appointment Booking & Reminders', desc: 'Automated slot confirmation and reminders for clinics & consultants' },
  { id: 'cart-recovery', label: 'Shopify Abandoned Cart Recovery', desc: 'Nudge shoppers who left items in checkout with automated follow-ups' },
];

export const BUSINESS_NICHES: BusinessNiche[] = [
  {
    id: 'real-estate',
    name: 'Real Estate & Builders',
    category: 'Property',
    focus: 'Project showcase sites, floor-plan galleries, Meta lead ads, and instant WhatsApp site-visit booking.',
    recommendedStack: ['Property Showcase Site', 'Meta Lead Ads', 'WhatsApp Visit Bot'],
    sampleLeadGoal: 'Site visits & verified buyer inquiries',
  },
  {
    id: 'dental-clinic',
    name: 'Dental & Medical Clinics',
    category: 'Healthcare',
    focus: 'Patient-trust clinic websites, treatment guides, local radius ads, and automated appointment reminders.',
    recommendedStack: ['Clinic Website', 'Local Radius Ads', 'Appointment Reminder Flow'],
    sampleLeadGoal: 'New patient consultations within 10–15 km',
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy & EPC',
    category: 'Clean Tech',
    focus: 'Rooftop savings calculators, commercial/residential subsidy guides, and high-intent regional lead funnels.',
    recommendedStack: ['Solar Calculator Funnel', 'District Geo-Targeted Ads', 'WhatsApp Quote Bot'],
    sampleLeadGoal: 'Homeowner & factory rooftop survey bookings',
  },
  {
    id: 'clothing-ecommerce',
    name: 'Clothing & D2C Fashion',
    category: 'E-Commerce',
    focus: 'High-speed Shopify storefronts, lookbook collections, Meta catalog sales ads, and COD verification.',
    recommendedStack: ['Shopify Storefront', 'Meta Sales Campaigns', 'Cart Recovery Bot'],
    sampleLeadGoal: 'Daily online orders & repeat customers',
  },
  {
    id: 'fitness-gym',
    name: 'Gyms & Fitness Studios',
    category: 'Wellness',
    focus: 'Transformation-focused landing pages, local membership offers, and automated trial pass scheduling.',
    recommendedStack: ['Offer Landing Page', '5–10 km Radius Ads', 'Trial Pass Automation'],
    sampleLeadGoal: 'Monthly membership signups',
  },
  {
    id: 'coaching-edtech',
    name: 'Coaching & Institutes',
    category: 'Education',
    focus: 'Course catalogs, demo-class registration funnels, and automated WhatsApp brochure delivery.',
    recommendedStack: ['Course Portal', 'Lead Generation Ads', 'Brochure Auto-Responder'],
    sampleLeadGoal: 'Demo class registrations & admissions',
  },
  {
    id: 'restaurant-cafe',
    name: 'Restaurants & Cloud Kitchens',
    category: 'Hospitality',
    focus: 'Direct commission-free ordering websites, table reservations, and hyper-local weekend footfall ads.',
    recommendedStack: ['Direct Menu Site', 'Hyper-Local Reach Ads', 'Table Reservation Bot'],
    sampleLeadGoal: 'Direct table bookings & repeat orders',
  },
  {
    id: 'salon-beauty',
    name: 'Salons & Skincare Studios',
    category: 'Lifestyle',
    focus: 'Service menus, bridal package showcases, Instagram reels ads, and automated slot reminders.',
    recommendedStack: ['Portfolio Website', 'Instagram Conversion Ads', 'Slot Reminder Bot'],
    sampleLeadGoal: 'Bridal & premium grooming bookings',
  },
  {
    id: 'auto-dealership',
    name: 'Automobile & EV Showrooms',
    category: 'Mobility',
    focus: 'Interactive vehicle showcase pages, test-ride booking forms, and city-wide Meta awareness ads.',
    recommendedStack: ['Model Showcase Site', 'City-Wide Lead Ads', 'Test-Ride Follow-Up'],
    sampleLeadGoal: 'Showroom test drives & finance inquiries',
  },
  {
    id: 'b2b-manufacturing',
    name: 'Manufacturers & Wholesalers',
    category: 'Industrial',
    focus: 'Clean corporate product catalogs, bulk RFQ inquiry forms, and pan-India dealer acquisition campaigns.',
    recommendedStack: ['B2B Catalog Website', 'Pan-India Lead Ads', 'Dealer Inquiry CRM'],
    sampleLeadGoal: 'Distributor & bulk B2B orders',
  },
];

export const SAMPLE_WEBSITES: SampleWebsite[] = [
  {
    id: 'sample-realestate',
    businessName: 'Aurelia Estates',
    industry: 'Real Estate',
    tagline: 'Luxury villa & residential project showcase with interactive floor-plan inquiry',
    imageUrl: '/src/assets/images/sample_real_estate_1795546841361.jpg',
    accentHex: '#1D4ED8',
    highlights: ['Interactive Property Filter', '3D Gallery View', 'Instant WhatsApp Site-Visit Booking'],
    sampleUrlLabel: 'aurelia-estates.mangalweb.demo',
    previewSections: {
      heroTitle: 'Architectural Residences Crafted for Quiet Daylight',
      heroSubtitle: 'Explore 3 & 4 BHK courtyard villas with private terraces, transparent floor plans, and instant site-visit scheduling.',
      metricsLabel: '42 Residences · RERA Approved · Direct Developer Desk',
      ctaText: 'Schedule Private Viewing',
    },
  },
  {
    id: 'sample-dental',
    businessName: 'Orora Dental Studio',
    industry: 'Dental Clinic',
    tagline: 'Warm, trust-first dental clinic portal with one-click treatment booking',
    imageUrl: '/src/assets/images/sample_dental_clinic_1795546841628.jpg',
    accentHex: '#0F766E',
    highlights: ['Treatment Cost Guide', 'Doctor Credentials', 'Automated Appointment Reminders'],
    sampleUrlLabel: 'orora-dental.mangalweb.demo',
    previewSections: {
      heroTitle: 'Gentle Precision Dentistry in a Calm Studio Setting',
      heroSubtitle: 'Digital smile design, painless implants, and preventive family care—book your 20-minute consultation online.',
      metricsLabel: 'Digital 3D Scan · Same-Day Crowns · Evening Slots Open',
      ctaText: 'Book Dental Consultation',
    },
  },
  {
    id: 'sample-solar',
    businessName: 'HeliosGrid Solar',
    industry: 'Solar Energy',
    tagline: 'Residential & commercial rooftop solar calculator and subsidy lead funnel',
    imageUrl: '/src/assets/images/sample_solar_energy_1795546841302.jpg',
    accentHex: '#D97706',
    highlights: ['kW Bill Savings Estimator', 'Subsidy Eligibility Check', 'Free Roof Survey Request'],
    sampleUrlLabel: 'heliosgrid-solar.mangalweb.demo',
    previewSections: {
      heroTitle: 'Turn Your Rooftop Into Clean, Predictable Power',
      heroSubtitle: 'Calculate your exact monthly electricity savings and check government rooftop subsidy eligibility in 30 seconds.',
      metricsLabel: '25-Year Panel Warranty · Net Metering Support · 48h Site Audit',
      ctaText: 'Calculate Roof Savings',
    },
  },
  {
    id: 'sample-ecommerce',
    businessName: 'Vastra Linen & Co.',
    industry: 'Clothing & Shopify',
    tagline: 'Minimalist Shopify D2C apparel storefront built for Meta Catalog Ads',
    imageUrl: '/src/assets/images/sample_ecommerce_store_1795546841328.jpg',
    accentHex: '#EA580C',
    highlights: ['One-Page UPI Checkout', 'Size & Fabric Drawer', 'WhatsApp Abandoned Cart Recovery'],
    sampleUrlLabel: 'vastra-linen.mangalweb.demo',
    previewSections: {
      heroTitle: 'Breathable Tailored Essentials for Every Season',
      heroSubtitle: 'Small-batch linen shirts and everyday leather goods with instant UPI checkout and tracked express dispatch.',
      metricsLabel: 'Free Exchanges · Express COD & UPI · Curated Drop 04',
      ctaText: 'Explore Collection',
    },
  },
  {
    id: 'sample-fitness',
    businessName: 'Kinetic Form Club',
    industry: 'Fitness & Gym',
    tagline: 'Neighborhood strength & conditioning club landing page for 5 km Meta Ads',
    accentHex: '#4338CA',
    highlights: ['7-Day Trial Pass Form', 'Coach Schedule Matrix', 'WhatsApp Slot Confirmation'],
    sampleUrlLabel: 'kinetic-club.mangalweb.demo',
    previewSections: {
      heroTitle: 'Structured Strength Training With Guided Coaching',
      heroSubtitle: 'Small-group mobility, strength blocks, and personalized nutrition check-ins—claim your 7-day studio pass.',
      metricsLabel: 'Max 12 per Batch · Morning & Late Evening Sessions',
      ctaText: 'Claim 7-Day Trial',
    },
  },
  {
    id: 'sample-cafe',
    businessName: 'Saffron & Stone Kitchen',
    industry: 'Hospitality & Dining',
    tagline: 'Direct table booking & commission-free takeaway site for local restaurants',
    accentHex: '#BE123C',
    highlights: ['Interactive Digital Menu', 'Zero-Commission Direct Orders', 'Weekend Table Reservation'],
    sampleUrlLabel: 'saffron-stone.mangalweb.demo',
    previewSections: {
      heroTitle: 'Wood-Fired Regional Craft & Slow-Roasted Coffee',
      heroSubtitle: 'Browse our seasonal menu, reserve an evening courtyard table, or order fresh pickup without aggregator markups.',
      metricsLabel: 'Direct Pickup · Private Dining · Open Daily 9 AM – 11 PM',
      ctaText: 'Reserve a Table',
    },
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How quickly can Mangal Web launch a custom website or Shopify store?',
    answer:
      'Focused landing pages and clinic or service websites typically go live within 5 to 7 working days once content is ready. Complete Shopify stores with payment gateways, shipping rules, and product catalogs usually launch in 10 to 14 days.',
  },
  {
    id: 'faq-2',
    question: 'Do I keep full ownership of my domain, code, Shopify account, and ad accounts?',
    answer:
      'Yes—100%. Every domain, hosting account, Shopify store, Meta Business Manager, and WhatsApp Business API stays registered directly under your own name and business credentials.',
  },
  {
    id: 'faq-3',
    question: 'How do you make sure Meta Ads reach the right local or e-commerce buyers?',
    answer:
      'We pair clean Meta Pixel and Conversions API event tracking with precise geographic pin-and-radius targeting, interest/lookalike testing, and dedicated landing pages so clicks turn into real WhatsApp chats, calls, or orders.',
  },
  {
    id: 'faq-4',
    question: 'Can WhatsApp automation connect directly with my website forms and Shopify store?',
    answer:
      'Yes. As soon as a customer submits an inquiry form or abandons a Shopify cart, an automated WhatsApp message greets them immediately, shares details or brochures, and notifies your team in real time.',
  },
  {
    id: 'faq-5',
    question: 'What if I am not sure whether I need a custom website, Shopify, or ads first?',
    answer:
      'You can select "Just Exploring" in the inquiry form below or ask our AI assistant on this page. We review your business stage, target area, and goals to suggest the simplest starting roadmap without unnecessary complexity.',
  },
  {
    id: 'faq-6',
    question: 'Do you support updates, speed checks, and ongoing campaign optimization after launch?',
    answer:
      'Every project includes post-launch handover guidance, mobile speed verification, and optional monthly care for creative refreshes, seasonal store updates, and ad performance tuning.',
  },
];

export const MAP_REGIONS: MapRegion[] = [
  { id: 'delhi', name: 'Delhi NCR', state: 'Delhi / Gurgaon / Noida', lat: 28.6139, lng: 77.209, xPercent: 48, yPercent: 28, baseDensityPerKm2: 11200 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, xPercent: 28, yPercent: 58, baseDensityPerKm2: 14500 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, xPercent: 44, yPercent: 77, baseDensityPerKm2: 9600 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, xPercent: 39, yPercent: 35, baseDensityPerKm2: 6400 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, xPercent: 25, yPercent: 46, baseDensityPerKm2: 7800 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, xPercent: 36, yPercent: 65, baseDensityPerKm2: 7200 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, xPercent: 49, yPercent: 64, baseDensityPerKm2: 8100 },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, xPercent: 60, yPercent: 35, baseDensityPerKm2: 6200 },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, xPercent: 42, yPercent: 48, baseDensityPerKm2: 5900 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, xPercent: 78, yPercent: 47, baseDensityPerKm2: 10800 },
];

export const URGENCY_OPTIONS = [
  { id: 'urgent', label: 'Urgent — Need it right away', hint: 'Priority kickoff within 24–48 hours' },
  { id: 'soon', label: 'Planning Soon (2–4 weeks)', hint: 'Preparing assets & launch timeline' },
  { id: 'info', label: 'Just Need Information', hint: 'Want clarity on scope & best approach' },
  { id: 'exploring', label: 'General Inquiry / Future Plan', hint: 'Comparing options for later' },
] as const;
