import { ExternalLink, Globe, X } from 'lucide-react';
import { SAMPLE_WEBSITES, type SampleWebsite } from '../data/agencyData';

interface SampleWebsitesSectionProps {
  activeSampleId: string | null;
  onOpenSample: (sampleId: string) => void;
  onCloseSample: () => void;
  onUseTemplateForInquiry: (industryName: string) => void;
}

export function SampleWebsitesSection({
  activeSampleId,
  onOpenSample,
  onCloseSample,
  onUseTemplateForInquiry,
}: SampleWebsitesSectionProps) {
  const activeSample: SampleWebsite | undefined = SAMPLE_WEBSITES.find(
    (s) => s.id === activeSampleId,
  );

  return (
    <section
      id="samples"
      className="border-b border-slate-200/80 bg-white py-14 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-blue-700">
            Reference Builds · Live Preview Library
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Sample Websites Across{' '}
            <span className="font-editorial italic font-medium text-orange-600">
              Real Industries
            </span>
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Explore how your business website can look and convert—click any reference project
            below to inspect its layout, features, and sample demo preview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_WEBSITES.map((sample) => (
            <article
              key={sample.id}
              data-testid={`sample-card-${sample.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Visual Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                {sample.imageUrl ? (
                  <img
                    src={sample.imageUrl}
                    alt={`${sample.businessName} — ${sample.industry} sample website`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col justify-between p-5"
                    style={{
                      background: `linear-gradient(135deg, ${sample.accentHex}12 0%, #f8fafc 100%)`,
                    }}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono-num">{sample.sampleUrlLabel}</span>
                      <Globe className="h-4 w-4" style={{ color: sample.accentHex }} />
                    </div>
                    <div className="space-y-2 rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-xs">
                      <div
                        className="h-2 w-12 rounded-full"
                        style={{ backgroundColor: sample.accentHex }}
                      />
                      <div className="text-sm font-semibold text-slate-900">
                        {sample.previewSections.heroTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {sample.previewSections.metricsLabel}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold" style={{ color: sample.accentHex }}>
                      {sample.industry}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-num truncate">{sample.sampleUrlLabel}</span>
                  </div>

                  <h3 className="font-display text-base font-semibold text-slate-900">
                    {sample.businessName}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{sample.tagline}</p>

                  <div className="pt-2 flex flex-wrap gap-y-1 text-[11px] text-slate-500">
                    {sample.highlights.map((h, i) => (
                      <span key={h}>
                        {i > 0 && <span className="mx-1.5" aria-hidden="true">·</span>}
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onOpenSample(sample.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Open Sample Preview</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onUseTemplateForInquiry(sample.industry)}
                    className="text-xs font-medium text-blue-700 hover:underline cursor-pointer"
                  >
                    Request Similar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Interactive Sample Website Preview Modal */}
      {activeSample && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sample-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Globe className="h-4 w-4 text-blue-700" />
                <span className="font-mono-num font-medium">{activeSample.sampleUrlLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{activeSample.industry}</span>
              </div>
              <button
                type="button"
                onClick={onCloseSample}
                aria-label="Close sample preview"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 space-y-3">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: activeSample.accentHex }}
                  >
                    {activeSample.businessName} · Reference Architecture
                  </p>
                  <h3
                    id="sample-modal-title"
                    className="font-display text-xl sm:text-2xl font-semibold text-slate-900 leading-snug"
                  >
                    {activeSample.previewSections.heroTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeSample.previewSections.heroSubtitle}
                  </p>
                  <p className="text-xs font-mono-num text-slate-500">
                    {activeSample.previewSections.metricsLabel}
                  </p>
                </div>

                <div className="md:col-span-6">
                  {activeSample.imageUrl ? (
                    <img
                      src={activeSample.imageUrl}
                      alt={activeSample.businessName}
                      referrerPolicy="no-referrer"
                      className="aspect-[4/3] w-full rounded-xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <div
                      className="aspect-[4/3] w-full rounded-xl border border-slate-200 p-5 flex flex-col justify-center items-start gap-2"
                      style={{ backgroundColor: `${activeSample.accentHex}10` }}
                    >
                      <span
                        className="text-xs font-semibold"
                        style={{ color: activeSample.accentHex }}
                      >
                        {activeSample.industry} Interactive Layout
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {activeSample.businessName}
                      </span>
                      <span className="text-xs text-slate-600">{activeSample.tagline}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold text-slate-800 mb-2">
                  Included Conversion Modules in This Reference
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeSample.highlights.map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseSample}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCloseSample();
                    onUseTemplateForInquiry(activeSample.industry);
                  }}
                  className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-blue-800 cursor-pointer"
                >
                  Build Similar for My Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
