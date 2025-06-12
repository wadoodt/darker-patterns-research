import { AlertTriangle } from 'lucide-react';
import type React from 'react';

interface IntroductionHeaderProps {
  currentStepNumber: number;
  totalSteps: number;
  contextError: string | null;
}

const IntroductionHeader: React.FC<IntroductionHeaderProps> = ({ currentStepNumber, totalSteps, contextError }) => {
  return (
    <>
      <div className="survey-step-title-container">
        <p className="survey-step-indicator">
          Step {currentStepNumber} of {totalSteps}: Welcome!
        </p>
        <h2 className="survey-main-title">Join the Dark Pattern Validation Study</h2>
      </div>

      <p className="font-body-academic text-light-text-secondary mb-6 text-sm leading-relaxed sm:text-base">
        Thank you for your interest! This study aims to create a human-validated dataset for detecting &quot;dark
        patterns&quot; in Large Language Models (LLMs). Your participation is crucial.
      </p>

      {contextError && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-red-300 bg-red-100 p-3 text-xs text-red-700">
          <AlertTriangle size={16} /> {contextError}
        </div>
      )}
    </>
  );
};

export default IntroductionHeader;
