// components/common/LightNavbar.tsx
'use client';

import { getLinkGroup, navLinks } from '@/lib/navigation';
import { usePathname } from 'next/navigation';
import React from 'react';
import CTAButton from '../landing/CTAButton';
import ProtectedLink from './ProtectedLink';
import StylizedLink from './StylizedLink';

interface LightNavbarProps {
  showUnsavedChangesModal?: (path: string) => void;
}

const LightNavbar: React.FC<LightNavbarProps> = ({ showUnsavedChangesModal }) => {
  const pathname = usePathname();
  const currentGroup = getLinkGroup(pathname);

  const mainNavLinks = navLinks.filter((link) => link.group === 'landing');

  // Helper function to determine if a path requires protection
  const needsProtection = (path: string): boolean => {
    return path.startsWith('/survey');
  };

  const renderLink = (href: string, className: string, children: React.ReactNode) => {
    if (needsProtection(href)) {
      return (
        <ProtectedLink
          href={href}
          className={className}
          onAttemptToNavigateWithUnsavedChanges={showUnsavedChangesModal}
        >
          {children}
        </ProtectedLink>
      );
    }
    return (
      <StylizedLink href={href} className={className} key={href}>
        {children}
      </StylizedLink>
    );
  };

  return (
    <header className="light-navbar sticky top-[0.375rem] z-50">
      {' '}
      {/* Assumes progress bar height of h-1.5 (0.375rem) */}
      <nav className="light-navbar-content">
        <div className="flex lg:flex-1">
          {renderLink(
            '/',
            '-m-1.5 flex items-center gap-2 p-1.5',
            <>
              <span className="light-navbar-logo-accent font-headline text-2xl font-bold">DPV</span>
              <span className="light-navbar-logo-text font-headline">Dark Pattern Validation</span>
            </>,
          )}
        </div>
        <div className="hidden lg:flex lg:gap-x-6">
          {mainNavLinks.map((link) => renderLink(link.href, 'light-navbar-link', link.label))}
        </div>
        <div className="flex flex-1 justify-end">
          {currentGroup === 'info' ? (
            <CTAButton href="/step-introduction" className="px-4 py-2 text-sm">
              Start Survey
            </CTAButton>
          ) : (
            renderLink('/login', 'light-navbar-action-button', 'Access for Researchers')
          )}
        </div>
      </nav>
    </header>
  );
};

export default LightNavbar;
