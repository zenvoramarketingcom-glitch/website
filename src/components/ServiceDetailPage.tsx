import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MessageCircle, Search } from 'lucide-react';
import {
  BUDGET_TIERS,
  BUSINESS_NICHES,
  META_AD_BUSINESSES,
  META_AD_GOALS,
  SERVICES,
  WEBSITE_FEATURES,
  WEBSITE_TYPES,
  WHATSAPP_FLOWS,
  type BusinessNiche,
  type ServiceId,
} from '../data/agencyData';
import { filterBusinessNiches, getServiceById, validateInquiryForm } from '../utils/agencyLogic';
import {
  AreaSelectorMap,
  createDefaultAreaValue,
  type SelectedAreaValue,
} from './AreaSelectorMap';

interface ServiceDetailPageProps {
  serviceId: ServiceId;
  onSelectService: (id: ServiceId) => void;
  onBackHome: () => void;
}

export function ServiceDetailPage({
  serviceId,
  onSelectService,
  onBackHome,
}: ServiceDetailPageProps) {
  const service = getServiceById(serviceId);

  // Meta Ads controls
  const [adGoal, setAdGoal] = useState(META_AD_GOALS[0].label);
  const [adBusiness, setAdBusiness] = useState(META_AD_BUSINESSES[0]);
  const [budgetTier, setBudgetTier] = useState(BUDGET_TIERS[1]);

  // Website controls
  const [websiteType, setWebsiteType] = useState(WEBSITE_TYPES[0].label);
  const [selectedWebFeatures, setSelectedWebFeatures] = useState<string[]>([
    WEBSITE_FEATURES[0],
    WEBSITE_FEATURES[1],
  ]);

  // WhatsApp controls
  const [selectedWaFlows, setSelectedWaFlows] = useState<string[]>([
    WHATSAPP_FLOWS[0].label,
  ]);
  const [waVolume, setWaVolume] = useState('Up to 2,000 chats / month');

  // Business Directory search controls
  const [nicheSearch, setNicheSearch] = useState('');
  const [nicheCategory, setNicheCategory] = useState('All');
  const [chosenNiche, setChosenNiche] = useState<BusinessNiche>(BUSINESS_NICHES[0]);

  // Map & Contact Form state
  const [area, setArea] = useState<SelectedAreaValue>(() => createDefaultAreaValue());
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [customBusiness, setCustomBusiness] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(BUSINESS_NICHES.map((n) => n.category)))],
    [],
  );

  const filteredNiches = useMemo(
    () => filterBusinessNiches(nicheSearch, nicheCategory),
    [nicheSearch, nicheCategory],
  );

  const toggleItem = (list: string[], setList: (next: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((i) => i !== value) : [...list, value]);
  };

  const resolvedBusinessType =
    serviceId === 'meta-ads'
      ? customBusiness.trim() || adBusiness
      : serviceId === 'businesses'
        ? customBusiness.trim() || chosenNiche.name
        : customBusiness.trim() || 'Local / Online Business';

  const buildBriefSummary = () => {
    if (serviceId === 'meta-ads') {
      return `Goal: ${adGoal} | Business: ${resolvedBusinessType} | Budget: ${budgetTier}`;
    }
    if (serviceId === 'websites') {
      return `Type: ${websiteType} | Features: ${selectedWebFeatures.join(', ') || 'Standard'} | Budget: ${budgetTier}`;
    }
    if (serviceId === 'whatsapp') {
      return `Flows: ${selectedWaFlows.join(', ') || 'Lead Auto-Reply'} | Volume: ${waVolume}`;
    }
    return `Industry: ${chosenNiche.name} | Stack: ${chosenNiche.recommendedStack.join(', ')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateInquiryForm({
      name,
      contact,
      businessType: resolvedBusinessType,
      serviceName: service.title,
      urgency: 'Service Configuration',
      areaSummary: area.summary,
      notes,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          businessType: resolvedBusinessType,
          serviceName: service.title,
          urgency: 'Configured Service Inquiry',
          areaSummary: area.summary,
          budget: budgetTier,
          goal: buildBriefSummary(),
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Could not send request. Please try again.');
      } else {
        setSubmittedRef(data.inquiry?.id || 'MW-CONFIRMED');
      }
    } catch {
      setSubmitError('Network error while saving inquiry. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `Hi Mangal, I configured a ${service.shortTitle} plan on Mangal Web.\nName: ${name || 'Client'}\nBusiness: ${resolvedBusinessType}\nDetails: ${buildBriefSummary()}\nTarget Area: ${area.summary}`,
  );

  return (
    <div data-testid={`service-detail-${serviceId}`} className="bg-slate-50 min-h-screen py-8 lg:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        {/* Top Breadcrumb + Service Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-wrap items-center gap-1.5">
            {SERVICES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSubmittedRef(null);
                  onSelectService(item.id);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  item.id === serviceId
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.shortTitle}
              </button>
            ))}
          </div>
        </div>

        {/* Service Sub-Page Header */}
        <div className="max-w-3xl space-y-2">
          <p className="font-mono-num text-xs font-medium" style={{ color: service.accentColor }}>
            {service.index} · Dedicated Service Configurator
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            {service.title}
          </h1>
          <p className="text-sm sm:text-[15px] leading-relaxed text-slate-600">
            {service.summary} Select your exact requirements, pick your target area on the map,
            and send your brief directly to Mangal.
          </p>
        </div>

        {/* Service-Specific Interactive Configurator */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          {serviceId === 'meta-ads' && (
            <>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  1. What do you want Meta Ads to achieve?
                </h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {META_AD_GOALS.map((goal) => {
                    const active = adGoal === goal.label;
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => setAdGoal(goal.label)}
                        className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-orange-600 bg-orange-50/60'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">{goal.label}</div>
                        <div className="mt-1 text-xs text-slate-600">{goal.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  2. Which business are we running ads for?
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {META_AD_BUSINESSES.map((biz) => {
                    const active = adBusiness === biz;
                    return (
                      <button
                        key={biz}
                        type="button"
                        onClick={() => setAdBusiness(biz)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {biz}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  3. Monthly Ad Spend Budget
                </h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudgetTier(tier)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                        budgetTier === tier
                          ? 'border-orange-600 bg-orange-50 text-orange-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {serviceId === 'websites' && (
            <>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  1. Choose Website or Store Format
                </h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WEBSITE_TYPES.map((type) => {
                    const active = websiteType === type.label;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setWebsiteType(type.label)}
                        className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-blue-700 bg-blue-50/60'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">{type.label}</div>
                        <div className="mt-1 text-xs text-slate-600">{type.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  2. Features &amp; Integrations Needed
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {WEBSITE_FEATURES.map((feat) => {
                    const active = selectedWebFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() =>
                          toggleItem(selectedWebFeatures, setSelectedWebFeatures, feat)
                        }
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'border-blue-700 bg-blue-700 text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {feat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">3. Estimated Project Scope</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {BUDGET_TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setBudgetTier(tier)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                        budgetTier === tier
                          ? 'border-blue-700 bg-blue-50 text-blue-900'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {serviceId === 'whatsapp' && (
            <>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  1. Select WhatsApp Automation Workflows
                </h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WHATSAPP_FLOWS.map((flow) => {
                    const active = selectedWaFlows.includes(flow.label);
                    return (
                      <button
                        key={flow.id}
                        type="button"
                        onClick={() => toggleItem(selectedWaFlows, setSelectedWaFlows, flow.label)}
                        className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-teal-700 bg-teal-50/70'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">{flow.label}</div>
                        <div className="mt-1 text-xs text-slate-600">{flow.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  2. Expected Monthly Conversations
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    'Up to 2,000 chats / month',
                    '2,000 – 10,000 chats / month',
                    '10,000+ broadcast & CRM scale',
                  ].map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setWaVolume(vol)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        waVolume === vol
                          ? 'border-teal-700 bg-teal-700 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {vol}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {serviceId === 'businesses' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Search All Business Blueprints
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pick your industry below to load its recommended website, ads &amp; automation stack
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={nicheSearch}
                    onChange={(e) => setNicheSearch(e.target.value)}
                    placeholder="Search clinic, solar, clothing..."
                    aria-label="Search business industries"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNicheCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      nicheCategory === cat
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredNiches.length === 0 ? (
                  <p className="col-span-full py-6 text-center text-xs text-slate-500">
                    No matching industry found. You can enter your custom business name in the form below.
                  </p>
                ) : (
                  filteredNiches.map((niche) => {
                    const selected = chosenNiche.id === niche.id;
                    return (
                      <button
                        key={niche.id}
                        type="button"
                        onClick={() => setChosenNiche(niche)}
                        className={`rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-indigo-700 bg-indigo-50/60'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-900">{niche.name}</span>
                          <span className="text-[11px] font-medium text-indigo-700">
                            {niche.category}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{niche.focus}</p>
                        <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium text-slate-500">
                          {niche.recommendedStack.map((stack, i) => (
                            <span key={stack}>
                              {i > 0 && <span className="mr-2">·</span>}
                              {stack}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form + Side-by-Side Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Send Your {service.shortTitle} Brief
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Selected setup: <span className="font-medium text-slate-700">{buildBriefSummary()}</span>
            </p>

            {submittedRef ? (
              <div
                data-testid="service-submit-success"
                className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                  <span>Request Received ({submittedRef})</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Mangal has received your {service.shortTitle} brief for{' '}
                  <strong>{resolvedBusinessType}</strong> covering <strong>{area.summary}</strong>.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={`https://wa.me/919999999999?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-800"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Send Copy on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedRef(null)}
                    className="rounded-lg border border-emerald-300 bg-white px-3.5 py-2 text-xs font-medium text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                  >
                    Send Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                <div>
                  <label htmlFor="sd-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    id="sd-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Verma"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="sd-contact" className="block text-xs font-medium text-slate-700 mb-1">
                    WhatsApp Number or Email
                  </label>
                  <input
                    id="sd-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+91 98765 43210 or you@business.com"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
                </div>

                <div>
                  <label htmlFor="sd-biz" className="block text-xs font-medium text-slate-700 mb-1">
                    Business / Brand Name (optional override)
                  </label>
                  <input
                    id="sd-biz"
                    type="text"
                    value={customBusiness}
                    onChange={(e) => setCustomBusiness(e.target.value)}
                    placeholder={`Currently: ${resolvedBusinessType}`}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="sd-notes" className="block text-xs font-medium text-slate-700 mb-1">
                    Project Notes
                  </label>
                  <textarea
                    id="sd-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell Mangal about your products, clinic treatments, property project, or target timeline..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                {submitError && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? 'Sending Brief...' : `Send ${service.shortTitle} Request to Mangal`}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-6">
            <AreaSelectorMap value={area} onChange={setArea} />
          </div>
        </div>
      </div>
    </div>
  );
}
