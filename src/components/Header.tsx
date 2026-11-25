import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import type { ServiceId } from '../data/agencyData';
import { searchCatalog, type SearchHit } from '../utils/agencyLogic';

interface HeaderProps {
  activeView: 'home' | ServiceId;
  onNavigateHome: (sectionId?: string) => void;
  onSelectService: (serviceId: ServiceId) => void;
  onOpenSample: (sampleId: string) => void;
}

export function Header({
  activeView,
  onNavigateHome,
  onSelectService,
  onOpenSample,
}: HeaderProps) {
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const hits = useMemo(() => searchCatalog(query), [query]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSelectHit = (hit: SearchHit) => {
    setSearchOpen(false);
    setQuery('');
    if (hit.type === 'sample' && hit.sampleId) {
      onOpenSample(hit.sampleId);
      return;
    }
    if (hit.serviceId) {
      onSelectService(hit.serviceId);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Zone 1: Clean single-line brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigateHome()}
          className="font-display text-lg font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-blue-700 transition-colors cursor-pointer"
        >
          Mangal Web
        </button>

        {/* Zone 2: Clean navigation links + interactive search */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-5 text-sm font-medium text-slate-600" aria-label="Primary navigation">
            <button
              type="button"
              onClick={() => onNavigateHome('services')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeView !== 'home' ? 'text-blue-700' : ''
              }`}
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('samples')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Samples
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('inquiry')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Inquiry
            </button>
            <button
              type="button"
              onClick={() => onNavigateHome('faq')}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              FAQ
            </button>
          </nav>

          {/* Compact Search Input */}
          <div ref={searchBoxRef} className="relative w-60 lg:w-72">
            <label htmlFor="header-search" className="sr-only">
              Search services, industries, or sample websites
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="header-search"
              type="search"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search services, dental, solar..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />

            {searchOpen && query.trim().length > 0 && (
              <div
                role="listbox"
                aria-label="Search suggestions"
                className="absolute left-0 right-0 top-full mt-1.5 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50"
              >
                {hits.length === 0 ? (
                  <p className="px-3 py-2.5 text-xs text-slate-500">
                    No matching service or business found. Try &ldquo;Shopify&rdquo;, &ldquo;Meta Ads&rdquo;, or &ldquo;Real Estate&rdquo;.
                  </p>
                ) : (
                  hits.map((hit) => (
                    <button
                      key={`${hit.type}-${hit.id}`}
                      type="button"
                      onClick={() => handleSelectHit(hit)}
                      className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="text-xs font-semibold text-slate-900">{hit.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{hit.subtitle}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Zone 3: Single Primary Action + Mobile Menu Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateHome('inquiry')}
            className="hidden sm:inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Start Project
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden space-y-3">
          <div className="relative">
            <label htmlFor="mobile-search" className="sr-only">
              Search services or industries
            </label>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="mobile-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search websites, Meta Ads, dental..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-800 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
            {query.trim().length > 0 && hits.length > 0 && (
              <div className="mt-1.5 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                {hits.map((hit) => (
                  <button
                    key={`mob-${hit.type}-${hit.id}`}
                    type="button"
                    onClick={() => {
                      handleSelectHit(hit);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full rounded px-2.5 py-2 text-left hover:bg-slate-50"
                  >
                    <div className="text-xs font-medium text-slate-900">{hit.title}</div>
                    <div className="text-[11px] text-slate-500 truncate">{hit.subtitle}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-700">
            <button
              type="button"
              onClick={() => {
                onNavigateHome('services');
                setMobileMenuOpen(false);
              }}
              className="py-1"
            >
              Services
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateHome('samples');
                setMobileMenuOpen(false);
              }}
              className="py-1"
            >
              Samples
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateHome('inquiry');
                setMobileMenuOpen(false);
              }}
              className="py-1"
            >
              Inquiry
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigateHome('faq');
                setMobileMenuOpen(false);
              }}
              className="py-1"
            >
              FAQ
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
