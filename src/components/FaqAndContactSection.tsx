import { useState } from 'react';
import { ChevronDown, Mail, MapPin, MessageCircle } from 'lucide-react';
import { FAQS, type ServiceId } from '../data/agencyData';

interface FaqAndContactSectionProps {
  onSelectService: (serviceId: ServiceId) => void;
  onJumpToSection: (sectionId: string) => void;
}

export function FaqAndContactSection({
  onSelectService,
  onJumpToSection,
}: FaqAndContactSectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQS[0].id);

  return (
    <>
      {/* Smart FAQs Section (No pricing/budget numbers inside FAQs) */}
      <section id="faq" className="border-b border-slate-200/80 bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-medium text-blue-700">Common Questions</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              How We Work &amp;{' '}
              <span className="font-editorial italic font-medium text-blue-700">
                What to Expect
              </span>
            </h2>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Contact Section */}
      <section id="contact" className="bg-slate-50 py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-2">
                <p className="text-xs font-medium text-orange-600">Direct Agency Desk</p>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                  Connect Directly with{' '}
                  <span className="font-editorial italic font-medium text-blue-700">Mangal</span>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Prefer a quick voice call, WhatsApp discussion, or email brief? Reach out
                  directly for websites, Shopify launches, Meta Ads, or WhatsApp automation.
                </p>
              </div>

              <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href="https://wa.me/919999999999?text=Hi%20Mangal%2C%20I%20visited%20Mangal%20Web%20and%20want%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-200 p-4 hover:border-emerald-600 hover:bg-emerald-50/40 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-700 mb-2" />
                  <div className="text-xs font-semibold text-slate-900">WhatsApp Chat</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">Fast response desk</div>
                </a>

                <a
                  href="mailto:hello@mangalweb.agency"
                  className="rounded-xl border border-slate-200 p-4 hover:border-blue-600 hover:bg-blue-50/40 transition-colors"
                >
                  <Mail className="h-4 w-4 text-blue-700 mb-2" />
                  <div className="text-xs font-semibold text-slate-900">Email Studio</div>
                  <div className="mt-0.5 text-[11px] text-slate-500 truncate">
                    hello@mangalweb.agency
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => onJumpToSection('inquiry')}
                  className="rounded-xl border border-slate-200 p-4 text-left hover:border-indigo-600 hover:bg-indigo-50/40 transition-colors cursor-pointer"
                >
                  <MapPin className="h-4 w-4 text-indigo-700 mb-2" />
                  <div className="text-xs font-semibold text-slate-900">Area Coverage</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Local Cities &amp; Pan-India
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-900">Mangal Web</span>
            <span aria-hidden="true">·</span>
            <span>Websites, Shopify, Meta Ads &amp; WhatsApp Automation</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onSelectService('websites')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Websites
            </button>
            <button
              type="button"
              onClick={() => onSelectService('meta-ads')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Meta Ads
            </button>
            <button
              type="button"
              onClick={() => onSelectService('whatsapp')}
              className="hover:text-slate-900 cursor-pointer"
            >
              WhatsApp Bots
            </button>
            <button
              type="button"
              onClick={() => onSelectService('businesses')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Industries
            </button>
            <span aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} Mangal Web</span>
          </div>
        </div>
      </footer>
    </>
  );
}
