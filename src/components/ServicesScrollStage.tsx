import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES, type ServiceId } from '../data/agencyData';
import { computeScrollServiceState } from '../utils/agencyLogic';
import { ThreeBackdrop } from './ThreeBackdrop';

interface ServicesScrollStageProps {
  onSelectService: (serviceId: ServiceId) => void;
}

export function ServicesScrollStage({ onSelectService }: ServicesScrollStageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const programmaticLockRef = useRef<number>(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualIndex, setManualIndex] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      if (Date.now() < programmaticLockRef.current) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const passed = Math.max(0, Math.min(scrollable, -rect.top + 64));
      const nextProgress = passed / scrollable;
      setScrollProgress(nextProgress);
      setManualIndex(null);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const effectiveProgress =
    manualIndex !== null ? manualIndex / (SERVICES.length - 1) : scrollProgress;

  const { activeIndex, cards } = computeScrollServiceState(effectiveProgress, SERVICES.length);

  const jumpToStep = (idx: number) => {
    programmaticLockRef.current = Date.now() + 1400;
    setManualIndex(idx);
    setScrollProgress(idx / (SERVICES.length - 1));
    const el = containerRef.current;
    if (!el) return;
    const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetTop = el.offsetTop - 64 + (idx / (SERVICES.length - 1)) * scrollable;
    window.scrollTo({ top: targetTop, behavior: 'auto' });
  };

  return (
    <section
      id="services"
      ref={containerRef}
      data-testid="services-scroll-stage"
      className="relative h-[300vh] border-b border-slate-200/80 bg-slate-50"
    >
      <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[540px] w-full overflow-hidden">
        {/* Three.js 3D Architectural Backdrop synced with scroll progress */}
        <ThreeBackdrop
          scrollProgress={effectiveProgress}
          activeServiceIndex={activeIndex}
          className="absolute inset-0 h-full w-full"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-4 sm:px-6 py-5 lg:py-6">
          {/* Top Stage Header + Direct Step Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-blue-700">
                Core Expertise · Scroll or select a service
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                What I Build &amp;{' '}
                <span className="font-editorial italic font-medium text-blue-700">Scale</span>
              </h2>
            </div>

            <div
              role="tablist"
              aria-label="Service focus switcher"
              className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 p-1 shadow-xs"
            >
              {SERVICES.map((service, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => jumpToStep(idx)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {service.index}. {service.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Perspective Card Stage */}
          <div className="relative mx-auto my-auto flex w-full max-w-4xl items-center justify-center h-[350px] sm:h-[360px]">
            {SERVICES.map((service, idx) => {
              const t = cards[idx];
              return (
                <article
                  key={service.id}
                  data-testid={`service-card-${service.id}`}
                  aria-hidden={!t.isActive}
                  style={{
                    opacity: t.opacity,
                    visibility: t.opacity < 0.08 ? 'hidden' : 'visible',
                    transform: `perspective(1200px) translate3d(0, ${t.translateY}px, ${t.translateZ}px) rotateX(${t.rotateX}deg) scale(${t.scale})`,
                    pointerEvents: t.isActive ? 'auto' : 'none',
                    zIndex: t.isActive ? 20 : 10 - Math.abs(idx - activeIndex),
                  }}
                  className="absolute inset-x-0 mx-auto w-full rounded-2xl border border-slate-200 bg-white/95 p-6 sm:p-8 shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 space-y-3.5">
                      <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500">
                        <span
                          className="font-mono-num font-semibold"
                          style={{ color: service.accentColor }}
                        >
                          {service.index} / 04
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{service.shortTitle}</span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                        <span
                          className="font-editorial italic font-medium"
                          style={{ color: service.accentColor }}
                        >
                          {service.accentWord}
                        </span>{' '}
                        {service.title.replace(service.accentWord, '').trim()}
                      </h3>

                      <p className="text-sm leading-relaxed text-slate-600">
                        {service.summary}
                      </p>

                      <p className="text-xs font-medium text-slate-800 pt-1">
                        {service.outcomeLine}
                      </p>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => onSelectService(service.id)}
                          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-medium text-white transition-transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                          style={{ backgroundColor: service.accentColor }}
                        >
                          <span>{service.ctaLabel}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div
                      className="md:col-span-5 rounded-xl border border-slate-200/80 p-4 sm:p-5 space-y-2.5"
                      style={{ backgroundColor: service.surfaceTint }}
                    >
                      <div className="text-xs font-semibold text-slate-800">
                        Included Deliverables
                      </div>
                      <ul className="space-y-2">
                        {service.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-slate-700 leading-snug"
                          >
                            <Check
                              className="h-3.5 w-3.5 mt-0.5 shrink-0"
                              style={{ color: service.accentColor }}
                              aria-hidden="true"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Bottom Stage Progress Indicator (kept clear of bottom-right AI launcher) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pr-44 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-mono-num font-medium text-slate-700">
                Service {activeIndex + 1} of {SERVICES.length}
              </span>
              <span aria-hidden="true">·</span>
              <span>Click button on card to configure</span>
            </div>
            <div className="h-1.5 w-40 sm:w-56 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-700 transition-all duration-150"
                style={{ width: `${Math.round(((activeIndex + 1) / SERVICES.length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
