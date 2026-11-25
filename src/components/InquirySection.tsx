import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { SERVICES, URGENCY_OPTIONS } from '../data/agencyData';
import { validateInquiryForm } from '../utils/agencyLogic';
import {
  AreaSelectorMap,
  createDefaultAreaValue,
  type SelectedAreaValue,
} from './AreaSelectorMap';

interface InquirySectionProps {
  preselectedIndustry?: string;
}

export function InquirySection({ preselectedIndustry }: InquirySectionProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [businessType, setBusinessType] = useState(preselectedIndustry || '');
  const [selectedServices, setSelectedServices] = useState<string[]>([SERVICES[0].shortTitle]);
  const [urgency, setUrgency] = useState<string>(URGENCY_OPTIONS[0].id);
  const [bioNotes, setBioNotes] = useState('');
  const [area, setArea] = useState<SelectedAreaValue>(() => createDefaultAreaValue());

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedIndustry) {
      setBusinessType(preselectedIndustry);
    }
  }, [preselectedIndustry]);

  const toggleService = (title: string) => {
    setSelectedServices((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title],
    );
  };

  const urgencyLabel =
    URGENCY_OPTIONS.find((u) => u.id === urgency)?.label || URGENCY_OPTIONS[0].label;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const serviceSummary = selectedServices.length
      ? selectedServices.join(', ')
      : 'General Web Consultation';

    const validation = validateInquiryForm({
      name,
      contact,
      businessType,
      serviceName: serviceSummary,
      urgency: urgencyLabel,
      areaSummary: area.summary,
      notes: bioNotes,
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
          businessType,
          serviceName: serviceSummary,
          urgency: urgencyLabel,
          areaSummary: area.summary,
          notes: bioNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || 'Could not submit inquiry. Please retry.');
      } else {
        setSubmittedId(data.inquiry?.id || 'MW-INQUIRY');
      }
    } catch {
      setSubmitError('Network error while submitting your form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappBrief = encodeURIComponent(
    `Hi Mangal, I submitted an inquiry on Mangal Web.\nName: ${name || 'Client'}\nBusiness: ${businessType || 'Business'}\nServices: ${selectedServices.join(', ')}\nUrgency: ${urgencyLabel}\nArea: ${area.summary}\nDetails: ${bioNotes}`,
  );

  return (
    <section
      id="inquiry"
      className="border-b border-slate-200/80 bg-slate-50 py-14 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-blue-700">
            Project Inquiry &amp; Territory Planner
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Tell Me About Your{' '}
            <span className="font-editorial italic font-medium text-blue-700">Business</span> &amp;
            Timeline
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether you need an urgent launch, a Shopify store, Meta Ads, or simply want clear
            information first—share your business bio and choose your target area on the side map.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            {submittedId ? (
              <div
                data-testid="main-inquiry-success"
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 space-y-3"
              >
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-base">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                  <span>Inquiry Saved ({submittedId})</span>
                </div>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your inquiry for{' '}
                  <strong>{businessType}</strong> ({urgencyLabel}) targeting{' '}
                  <strong>{area.summary}</strong> is ready.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <a
                    href={`https://wa.me/919999999999?text=${whatsappBrief}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Message Mangal on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedId(null)}
                    className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-medium text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Urgency / Intent selector */}
                <div>
                  <span className="block text-xs font-semibold text-slate-800 mb-2">
                    1. How soon do you need this?
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {URGENCY_OPTIONS.map((opt) => {
                      const active = urgency === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setUrgency(opt.id)}
                          className={`rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                            active
                              ? 'border-blue-700 bg-blue-50/70'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-semibold text-slate-900">{opt.label}</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">{opt.hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Services Multi-select */}
                <div>
                  <span className="block text-xs font-semibold text-slate-800 mb-2">
                    2. Services You&apos;re Interested In
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => {
                      const active = selectedServices.includes(s.shortTitle);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.shortTitle)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {s.shortTitle}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact & Business Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="inq-name"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      id="inq-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="inq-contact"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Phone / WhatsApp or Email
                    </label>
                    <input
                      id="inq-contact"
                      type="text"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    {errors.contact && (
                      <p className="mt-1 text-xs text-red-600">{errors.contact}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inq-business"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Business Type / Industry
                  </label>
                  <input
                    id="inq-business"
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="e.g. Real Estate Agency, Dental Clinic, Clothing Shopify Store, Solar EPC..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                  {errors.businessType && (
                    <p className="mt-1 text-xs text-red-600">{errors.businessType}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="inq-bio"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Business Bio &amp; What You Want Built
                  </label>
                  <textarea
                    id="inq-bio"
                    rows={3}
                    value={bioNotes}
                    onChange={(e) => setBioNotes(e.target.value)}
                    placeholder="Share a quick overview of your business, current website/store link (if any), and your goal..."
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
                  className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry & Target Area'}
                </button>
              </form>
            )}
          </div>

          {/* Right Side Map */}
          <div className="lg:col-span-5">
            <AreaSelectorMap value={area} onChange={setArea} />
          </div>
        </div>
      </div>
    </section>
  );
}
