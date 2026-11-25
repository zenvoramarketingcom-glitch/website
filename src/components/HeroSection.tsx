import { ArrowDown, ArrowUpRight, User } from 'lucide-react';
import { FOUNDER_IMAGE } from '../data/agencyData';

interface HeroSectionProps {
  onExploreServices: () => void;
  onStartInquiry: () => void;
}

export function HeroSection({ onExploreServices, onStartInquiry }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-white via-slate-50/70 to-slate-50"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Side: Medium-sized catchy multi-font intro */}
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-medium tracking-wide text-blue-700">
              Mangal Web Studio · Websites, Ads &amp; Business Automation
            </p>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 leading-[1.22] text-balance">
              Hi, I&apos;m{' '}
              <span className="font-editorial italic font-semibold text-blue-700">Mangal</span>
              {' '}— building{' '}
              <span className="font-editorial italic font-medium text-orange-600">
                growth-ready
              </span>{' '}
              websites, Shopify stores &amp; ad systems.
            </h1>

            <p className="max-w-xl text-[15px] leading-relaxed text-slate-600">
              I help ambitious businesses turn visitors into daily enquiries and sales. From clean
              custom websites and Shopify e-commerce stores to hyper-targeted Meta Ads and instant
              WhatsApp automation, everything is designed and engineered end-to-end under one roof.
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
              <span className="text-blue-700">Real Estate</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700">Dental Clinics</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700">Solar Energy</span>
              <span aria-hidden="true">·</span>
              <span className="text-orange-600">Shopify &amp; D2C</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-700">WhatsApp Automation</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onExploreServices}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Scroll 3D Services</span>
                <ArrowDown className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onStartInquiry}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:border-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Request Project Plan</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Side: Founder Portrait + Subtle smaller caption below */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            <div className="w-full max-w-[330px]">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-blue-50 shadow-sm">
                <img
                  src={FOUNDER_IMAGE}
                  alt="Mangal — 18-year-old founder of Mangal Web digital agency"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <User className="h-10 w-10" />
                  <span className="text-xs font-medium">Mangal · Founder</span>
                </div>
              </div>

              {/* Subtle, attractive smaller metadata caption right below portrait */}
              <div className="mt-3 px-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-sm font-semibold text-slate-900">
                    Mangal
                  </span>
                  <span className="font-mono-num text-xs text-blue-700 font-medium">
                    Age 18 · Founder
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  Full-stack Web Designer, Shopify Builder, Meta Ads Strategist &amp; WhatsApp
                  Automation Specialist — hands-on across local &amp; e-commerce niches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
