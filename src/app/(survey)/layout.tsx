// app/(survey)/layout.tsx
'use client';
import LightNavbar from '@/components/common/LightNavbar';
import ProgressBar from '@/components/common/ProgressBar';
import UnsavedChangesModal from '@/components/common/UnsavedChangesModal'; // Import Modal
import SurveyNavigationFooter from '@/components/survey/SurveyNavigationFooter';
import { SurveyProgressProvider, useSurveyProgress } from '@/contexts/SurveyProgressContext';
import { useEffect, useState, type ReactNode } from 'react';

// Inner component to access context for beforeunload and modal
const SurveyLayoutContent = ({ children }: { children: ReactNode }) => {
  const { hasUnsavedChanges, setHasUnsavedChanges } = useSurveyProgress();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);

  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome to show the prompt
        return ''; // For other browsers
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [hasUnsavedChanges]);

  // This function will be passed to ProtectedLink
  const showUnsavedChangesModal = (path: string) => {
    setNextPath(path);
    setIsModalOpen(true);
  };

  const handleModalLeave = () => {
    if (nextPath) {
      setHasUnsavedChanges(false); // Assume user wants to discard changes
      // Actual navigation will be handled by ProtectedLink's internal router.push
      // Or if ProtectedLink's onClick is modified, it can directly navigate here.
      // For now, ProtectedLink will handle the navigation after confirmation.
    }
    setIsModalOpen(false);
    setNextPath(null);
  };

  const handleModalStay = () => {
    setIsModalOpen(false);
    setNextPath(null);
  };

  return (
    <div className="bg-light-bg-primary text-light-text-secondary flex min-h-screen flex-col">
      {' '}
      {/* Removed theme-light-survey */}
      <ProgressBar />
      <LightNavbar showUnsavedChangesModal={showUnsavedChangesModal} />
      <main className="survey-content-scroll-area flex-grow pt-6 pb-24">{children}</main>
      <SurveyNavigationFooter />
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onLeave={handleModalLeave}
        onStay={handleModalStay}
        nextPath={nextPath} // Pass nextPath to allow modal to navigate if "Leave" is chosen
      />
    </div>
  );
};

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return (
    <SurveyProgressProvider>
      <SurveyLayoutContent>{children}</SurveyLayoutContent>
    </SurveyProgressProvider>
  );
}
