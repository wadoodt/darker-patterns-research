// app/(info)/layout.tsx
import LightNavbar from '@/components/common/LightNavbar';
import LightFooter from '@/components/common/LightFooter';
import type React from 'react';

export default function InfoPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-light-bg-primary text-light-text-secondary flex min-h-screen flex-col">
      {' '}
      {/* Removed theme-light-info */}
      <LightNavbar />
      <main className="flex-grow py-8 md:py-12">{children}</main>
      <LightFooter />
    </div>
  );
}
