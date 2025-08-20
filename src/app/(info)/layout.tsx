// app/(info)/layout.tsx
import LightFooter from '@/components/common/LightFooter';
import LightNavbar from '@/components/common/LightNavbar';
import { SurveyProgressProvider } from '@/contexts/SurveyProgressContext';
import type React from 'react';

export default function InfoPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-light-bg-primary text-light-text-secondary flex min-h-screen flex-col">
      <SurveyProgressProvider>
        <LightNavbar />
        <main className="flex-grow py-8 md:py-12">{children}</main>
        <LightFooter />
      </SurveyProgressProvider>
    </div>
  );
}
