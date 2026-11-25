import { useState } from 'react';
import { AiChatWidget } from './components/AiChatWidget';
import { FaqAndContactSection } from './components/FaqAndContactSection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { InquirySection } from './components/InquirySection';
import { SampleWebsitesSection } from './components/SampleWebsitesSection';
import { ServiceDetailPage } from './components/ServiceDetailPage';
import { ServicesScrollStage } from './components/ServicesScrollStage';
import type { ServiceId } from './data/agencyData';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | ServiceId>('home');
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [preselectedIndustry, setPreselectedIndustry] = useState<string>('');

  const jumpToSection = (sectionId?: string) => {
    setActiveView('home');
    requestAnimationFrame(() => {
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const handleSelectService = (serviceId: ServiceId) => {
    setActiveView(serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSample = (sampleId: string) => {
    setActiveView('home');
    setActiveSampleId(sampleId);
    requestAnimationFrame(() => {
      const el = document.getElementById('samples');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleUseTemplateForInquiry = (industryName: string) => {
    setPreselectedIndustry(industryName);
    jumpToSection('inquiry');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header
        activeView={activeView}
        onNavigateHome={jumpToSection}
        onSelectService={handleSelectService}
        onOpenSample={handleOpenSample}
      />

      <main>
        {activeView === 'home' ? (
          <>
            <HeroSection
              onExploreServices={() => jumpToSection('services')}
              onStartInquiry={() => jumpToSection('inquiry')}
            />
            <ServicesScrollStage onSelectService={handleSelectService} />
            <SampleWebsitesSection
              activeSampleId={activeSampleId}
              onOpenSample={setActiveSampleId}
              onCloseSample={() => setActiveSampleId(null)}
              onUseTemplateForInquiry={handleUseTemplateForInquiry}
            />
            <InquirySection preselectedIndustry={preselectedIndustry} />
            <FaqAndContactSection
              onSelectService={handleSelectService}
              onJumpToSection={jumpToSection}
            />
          </>
        ) : (
          <ServiceDetailPage
            serviceId={activeView}
            onSelectService={handleSelectService}
            onBackHome={() => jumpToSection('services')}
          />
        )}
      </main>

      <AiChatWidget />
    </div>
  );
}
