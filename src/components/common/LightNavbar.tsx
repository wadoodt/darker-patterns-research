// components/common/LightNavbar.tsx
'use client';

import { getLinkGroup, navLinks } from '@/lib/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';
import CTAButton from '../landing/CTAButton';
import ProtectedLink from './ProtectedLink';

interface LightNavbarProps {
  showUnsavedChangesModal?: (path: string) => void;
  hasUnsavedChanges?: boolean; // Optional prop for unsaved changes state
}

const LightNavbar: React.FC<LightNavbarProps> = ({ showUnsavedChangesModal }) => {
  const pathname = usePathname();
  const currentGroup = getLinkGroup(pathname);

  const mainNavLinks = navLinks.filter((link) => link.group === 'landing');

  return (
    <header className="light-navbar sticky top-[0.375rem] z-50">
      <nav className="light-navbar-content">
        <div className="flex lg:flex-1">
          <ProtectedLink
            href="/"
            className="light-navbar-logo"
            onAttemptToNavigateWithUnsavedChanges={showUnsavedChangesModal}
          >
            <span className="light-navbar-logo-accent font-headline text-2xl font-bold">DPV</span>
            <span className="light-navbar-logo-text font-headline">Dark Pattern Validation</span>
          </ProtectedLink>
        </div>
        <div className="hidden lg:flex lg:gap-x-6">
          {mainNavLinks.map((link) => (
            <ProtectedLink
              key={link.href}
              href={link.href}
              className={`light-navbar-link ${pathname.includes(link.href) ? 'disabled' : ''}`}
              onAttemptToNavigateWithUnsavedChanges={showUnsavedChangesModal}
            >
              {link.label}
            </ProtectedLink>
          ))}
        </div>
        <div className="flex flex-1 justify-end">
          {currentGroup === 'info' ? (
            <CTAButton href="/step-introduction" className="px-4 py-2 text-sm">
              Start Survey
            </CTAButton>
          ) : (
            <ProtectedLink
              href="/login"
              className="light-navbar-action-button"
              onAttemptToNavigateWithUnsavedChanges={showUnsavedChangesModal}
            >
              Access for Researchers
            </ProtectedLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default LightNavbar;
