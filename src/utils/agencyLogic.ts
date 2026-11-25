import {
  BUSINESS_NICHES,
  SAMPLE_WEBSITES,
  SERVICES,
  type BusinessNiche,
  type SampleWebsite,
  type ServiceId,
  type ServiceItem,
} from '../data/agencyData';

export interface SearchHit {
  type: 'service' | 'sample' | 'industry';
  id: string;
  title: string;
  subtitle: string;
  serviceId?: ServiceId;
  sampleId?: string;
}

export function searchCatalog(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const hits: SearchHit[] = [];

  for (const s of SERVICES) {
    if (
      s.title.toLowerCase().includes(q) ||
      s.shortTitle.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.deliverables.some((d) => d.toLowerCase().includes(q))
    ) {
      hits.push({
        type: 'service',
        id: s.id,
        title: s.title,
        subtitle: `Service · ${s.outcomeLine}`,
        serviceId: s.id,
      });
    }
  }

  for (const sample of SAMPLE_WEBSITES) {
    if (
      sample.businessName.toLowerCase().includes(q) ||
      sample.industry.toLowerCase().includes(q) ||
      sample.tagline.toLowerCase().includes(q)
    ) {
      hits.push({
        type: 'sample',
        id: sample.id,
        title: `${sample.businessName} (${sample.industry})`,
        subtitle: `Sample Website · ${sample.tagline}`,
        sampleId: sample.id,
      });
    }
  }

  for (const niche of BUSINESS_NICHES) {
    if (
      niche.name.toLowerCase().includes(q) ||
      niche.category.toLowerCase().includes(q) ||
      niche.focus.toLowerCase().includes(q)
    ) {
      hits.push({
        type: 'industry',
        id: niche.id,
        title: niche.name,
        subtitle: `${niche.category} Blueprint · ${niche.sampleLeadGoal}`,
        serviceId: 'businesses',
      });
    }
  }

  return hits.slice(0, 8);
}

export function filterBusinessNiches(query: string, category: string): BusinessNiche[] {
  const q = query.trim().toLowerCase();
  return BUSINESS_NICHES.filter((niche) => {
    const matchesCategory = category === 'All' || niche.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      niche.name.toLowerCase().includes(q) ||
      niche.category.toLowerCase().includes(q) ||
      niche.focus.toLowerCase().includes(q) ||
      niche.recommendedStack.some((item) => item.toLowerCase().includes(q))
    );
  });
}

export interface ServiceCard3DTransform {
  index: number;
  isActive: boolean;
  offset: number;
  opacity: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  scale: number;
}

export function computeScrollServiceState(
  scrollProgress: number,
  totalCards: number,
): { activeIndex: number; cards: ServiceCard3DTransform[] } {
  const clamped = Math.max(0, Math.min(1, scrollProgress));
  const scaled = clamped * Math.max(0, totalCards - 1);
  const activeIndex = Math.round(scaled);

  const cards: ServiceCard3DTransform[] = Array.from({ length: totalCards }, (_, i) => {
    const offset = i - scaled;
    const absOffset = Math.abs(offset);
    const opacity = Math.max(0, Math.min(1, 1 - absOffset * 0.95));
    const translateY = offset * 68;
    const translateZ = -absOffset * 140;
    const rotateX = Math.max(-24, Math.min(24, offset * -14));
    const scale = Math.max(0.84, 1 - absOffset * 0.1);

    return {
      index: i,
      isActive: i === activeIndex,
      offset,
      opacity: Number(opacity.toFixed(3)),
      translateY: Number(translateY.toFixed(1)),
      translateZ: Number(translateZ.toFixed(1)),
      rotateX: Number(rotateX.toFixed(2)),
      scale: Number(scale.toFixed(3)),
    };
  });

  return { activeIndex, cards };
}

export function estimateTargetReach(
  radiusKm: number,
  coverageMode: 'radius' | 'pan-india' | 'global',
  baseDensityPerKm2: number,
): { areaLabel: string; estimatedAudience: string } {
  if (coverageMode === 'pan-india') {
    return {
      areaLabel: 'Pan-India Coverage',
      estimatedAudience: '45M+ active digital buyers',
    };
  }
  if (coverageMode === 'global') {
    return {
      areaLabel: 'International Markets',
      estimatedAudience: 'Multi-region global reach',
    };
  }
  const safeRadius = Math.max(3, Math.min(100, radiusKm));
  const areaKm2 = Math.PI * safeRadius * safeRadius;
  // Digital active reach factor (~14% of physical population density capped cleanly)
  const rawEstimate = Math.round(areaKm2 * baseDensityPerKm2 * 0.14);
  const formatted =
    rawEstimate >= 1_000_000
      ? `${(rawEstimate / 1_000_000).toFixed(1)}M+ people`
      : rawEstimate >= 1_000
        ? `${Math.round(rawEstimate / 1_000)}K+ people`
        : `${rawEstimate}+ people`;

  return {
    areaLabel: `${safeRadius} km radius (~${Math.round(areaKm2).toLocaleString('en-IN')} sq km)`,
    estimatedAudience: formatted,
  };
}

export interface InquiryInput {
  name: string;
  contact: string;
  businessType: string;
  serviceName: string;
  urgency: string;
  areaSummary: string;
  notes?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateInquiryForm(input: InquiryInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  const cleanContact = input.contact.trim();
  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanContact);
  const digits = cleanContact.replace(/\D/g, '');
  const hasPhone = digits.length >= 10 && digits.length <= 15;
  if (!hasEmail && !hasPhone) {
    errors.contact = 'Enter a valid WhatsApp phone number (10+ digits) or email address.';
  }

  if (!input.businessType || input.businessType.trim().length < 2) {
    errors.businessType = 'Please specify your business category.';
  }

  if (!input.areaSummary || input.areaSummary.trim().length < 2) {
    errors.areaSummary = 'Please select a target area on the map.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getServiceById(id: ServiceId): ServiceItem {
  return SERVICES.find((s) => s.id === id) ?? SERVICES[0];
}

export function getSampleById(id: string): SampleWebsite | undefined {
  return SAMPLE_WEBSITES.find((s) => s.id === id);
}
