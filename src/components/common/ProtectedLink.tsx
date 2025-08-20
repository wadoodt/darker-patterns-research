// src/components/common/ProtectedLink.tsx
'use client';
import Link, { type LinkProps } from 'next/link';

import type React from 'react';
import { useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import UnsavedChangesModal from './UnsavedChangesModal';

interface ProtectedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onAttemptToNavigateWithUnsavedChanges?: (nextPath: string) => void;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  href,
  children,
  className,
  onAttemptToNavigateWithUnsavedChanges,
  ...props
}) => {
  const { hasUnsavedChanges, setHasUnsavedChanges } = useSurveyProgress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intendedHref, setIntendedHref] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (onAttemptToNavigateWithUnsavedChanges) {
        // Use parent modal handling
        onAttemptToNavigateWithUnsavedChanges(href.toString());
      } else {
        // Use self-contained modal
        setIntendedHref(href.toString());
        setIsModalOpen(true);
      }
    }
    // If no unsaved changes, Link's default behavior will navigate
  };

  const handleLeave = () => {
    setHasUnsavedChanges(false); // User chose to discard changes
    setIsModalOpen(false);
    setIntendedHref(null);
  };

  const handleStay = () => {
    setIsModalOpen(false);
    setIntendedHref(null);
  };

  return (
    <>
      <Link href={href} onClick={handleClick} className={className} {...props}>
        {children}
      </Link>
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onLeave={handleLeave}
        onStay={handleStay}
        nextPath={intendedHref}
        handleNavigation={true}
      />
    </>
  );
};

export default ProtectedLink;
