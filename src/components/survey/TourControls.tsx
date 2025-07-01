// This is a development utility component for testing tour functionality
// Remove or comment out in production

'use client';

import { useSurveyTour } from '@/hooks/useSurveyTour';

interface TourControlsProps {
  className?: string;
}

export const TourControls: React.FC<TourControlsProps> = ({ className = '' }) => {
  const { startTour, shouldShowTour } = useSurveyTour();

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
        >
          Start Tour
        </button>
      </div>
    </div>
  );
};

export default TourControls;
