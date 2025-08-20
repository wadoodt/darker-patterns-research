import type React from 'react';

interface IntroductionHeaderProps {
  currentStepNumber: number;
  totalSteps: number;
}

const IntroductionHeader: React.FC<IntroductionHeaderProps> = ({ currentStepNumber, totalSteps }) => {
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
    </>
  );
};

export default IntroductionHeader;
