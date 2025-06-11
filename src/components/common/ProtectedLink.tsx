// src/components/common/ProtectedLink.tsx
'use client';
import Link, { type LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext'; // Adjust path as needed
import UnsavedChangesModal from './UnsavedChangesModal'; // Adjust path

interface ProtectedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  // Callback to open the modal, managed by parent layout
  onAttemptToNavigateWithUnsavedChanges?: (nextPath: string) => void;
}

const ProtectedLink: React.FC<ProtectedLinkProps> = ({
  href,
  children,
  className,
  onAttemptToNavigateWithUnsavedChanges, // This prop might not be needed if modal is global
  ...props
}) => {
  const { hasUnsavedChanges, setHasUnsavedChanges } = useSurveyProgress();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intendedHref, setIntendedHref] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      if (onAttemptToNavigateWithUnsavedChanges) {
        onAttemptToNavigateWithUnsavedChanges(href.toString());
      } else {
        setIntendedHref(href.toString());
        setIsModalOpen(true);
      }
    }
    // If no unsaved changes, Link's default behavior will navigate
  };

  const handleLeave = () => {
    if (intendedHref) {
      setHasUnsavedChanges(false); // User chose to discard changes
      router.push(intendedHref);
    }
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
      <UnsavedChangesModal isOpen={isModalOpen} onLeave={handleLeave} onStay={handleStay} nextPath={intendedHref} />
    </>
  );
};

export default ProtectedLink;
