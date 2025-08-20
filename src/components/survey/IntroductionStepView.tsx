import type React from 'react';
import IntroductionHeader from './sections/IntroductionHeader';
import ParticipationOptions from './sections/ParticipationOptions';
import PrivacySection from './sections/PrivacySection';

interface IntroductionStepViewProps {
  currentStepNumber: number;
  totalSteps: number;
  selectedOption: 'email' | 'anonymous' | null;
  localEmail: string;
  agreedToTermsEmail: boolean;
  agreedToTermsAnonymous: boolean;
  emailCardError: string | null;
  anonymousCardError: string | null;
  onOptionSelect: (option: 'email' | 'anonymous') => void;
  onTermsChange: (type: 'email' | 'anonymous', checked: boolean | 'indeterminate') => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const IntroductionStepView: React.FC<IntroductionStepViewProps> = ({
  currentStepNumber,
  totalSteps,
  selectedOption,
  localEmail,
  agreedToTermsEmail,
  agreedToTermsAnonymous,
  emailCardError,
  anonymousCardError,
  onOptionSelect,
  onTermsChange,
  onEmailChange,
}) => {
  return (
    <div className="survey-page-container max-w-2xl">
      <IntroductionHeader currentStepNumber={currentStepNumber} totalSteps={totalSteps} />
      <ParticipationOptions
        selectedOption={selectedOption}
        localEmail={localEmail}
        agreedToTermsEmail={agreedToTermsEmail}
        agreedToTermsAnonymous={agreedToTermsAnonymous}
        emailCardError={emailCardError}
        anonymousCardError={anonymousCardError}
        onOptionSelect={onOptionSelect}
        onTermsChange={onTermsChange}
        onEmailChange={onEmailChange}
      />
      <PrivacySection />
    </div>
  );
};

export default IntroductionStepView;
