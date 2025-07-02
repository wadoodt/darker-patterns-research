// This is a development utility component for testing tour functionality
// Remove or comment out in production

'use client';

import { useSurveyTour } from '@/hooks/useSurveyTour';
import { useEffect, useState } from 'react';

interface TourControlsProps {
  className?: string;
}

export const TourControls: React.FC<TourControlsProps> = ({ className = '' }) => {
  const { startTour, shouldShowTour, resetTourForCurrentDevice } = useSurveyTour();
  const [showReset, setShowReset] = useState(false);

  // Only show reset button if the tour is not active
  useEffect(() => {
    setShowReset(!shouldShowTour);
  }, [shouldShowTour]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className={`fixed top-4 right-4 z-50 rounded border border-gray-300 bg-white p-2 shadow-lg ${className}`}>
      <div className="mb-2 text-xs text-gray-600">Tour Debug Controls</div>
      <div className="mb-2 text-xs text-gray-500">Device-based tracking (no user ID needed)</div>
      <div className="mb-2 text-xs text-gray-500">Should show tour: {shouldShowTour ? 'Yes' : 'No'}</div>
      <div className="space-y-1">
        <button
          onClick={startTour}
          className="block w-full rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          disabled={shouldShowTour}
        >
          {shouldShowTour ? 'Tour in Progress' : 'Start Tour'}
        </button>
        {showReset && (
          <button
            onClick={() => {
              resetTourForCurrentDevice();
              setShowReset(false);
            }}
            className="mt-1 block w-full rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
          >
            Reset Tour (Testing)
          </button>
        )}
      </div>
    </div>
  );
};

export default TourControls;
