import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Award, Mail, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface TermsCheckboxProps {
  type: 'email' | 'anonymous';
  checked: boolean;
  onCheckedChange: (checked: boolean | 'indeterminate') => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ type, checked, onCheckedChange }) => (
  <div className="terms-checkbox-label">
    <Checkbox
      id={`terms${type === 'email' ? 'Email' : 'Anonymous'}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={checked ? 'form-checkbox-custom-light' : 'form-checkbox-custom-light border-red-500'}
    />
    <label htmlFor={`terms${type === 'email' ? 'Email' : 'Anonymous'}`} className="ml-2 text-xs">
      I agree to the{' '}
      <Link href="/terms-conditions" className="link-standard-light" target="_blank">
        Terms
      </Link>{' '}
      &amp;{' '}
      <Link href="/ethics-privacy-participation" className="link-standard-light" target="_blank">
        Privacy Policy
      </Link>
      .
    </label>
  </div>
);

interface EmailOptionCardProps {
  isSelected: boolean;
  isRecommended: boolean;
  onSelect: () => void;
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  termsAgreed: boolean;
  onTermsChange: (checked: boolean | 'indeterminate') => void;
}

const EmailOptionCard: React.FC<EmailOptionCardProps> = ({
  isSelected,
  isRecommended,
  onSelect,
  email,
  onEmailChange,
  termsAgreed,
  onTermsChange,
}) => (
  <div
    onClick={onSelect}
    className={`auth-option-card-survey ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect()}
  >
    {isRecommended && (
      <span className="auth-option-badge">
        <Award size={12} className="mr-0.5 inline" />
        Recommended
      </span>
    )}
    <Mail size={24} className="text-brand-purple-500 mx-auto mb-2" />
    <h4 className="auth-option-title text-center">Participate with Email</h4>
    <div className="auth-option-description">
      <ul>
        <li>Receive research updates.</li>
        <li>Get a copy of the published paper.</li>
        <li>Contribute to a richer dataset.</li>
      </ul>
    </div>
    {isSelected && (
      <div className="mt-auto space-y-2 pt-3">
        <Input
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={onEmailChange}
          className="form-input-light h-9 text-xs"
          required
        />
        <TermsCheckbox type="email" checked={termsAgreed} onCheckedChange={onTermsChange} />
      </div>
    )}
  </div>
);

interface AnonymousOptionCardProps {
  isSelected: boolean;
  onSelect: () => void;
  termsAgreed: boolean;
  onTermsChange: (checked: boolean | 'indeterminate') => void;
}

const AnonymousOptionCard: React.FC<AnonymousOptionCardProps> = ({
  isSelected,
  onSelect,
  termsAgreed,
  onTermsChange,
}) => (
  <div
    onClick={onSelect}
    className={`auth-option-card-survey ${isSelected ? 'selected' : ''}`}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect()}
  >
    <User size={24} className="text-brand-purple-500 mx-auto mb-2" />
    <h4 className="auth-option-title text-center">Participate Anonymously</h4>
    <div className="auth-option-description">
      <ul>
        <li>No email required.</li>
        <li>Your responses remain fully anonymous.</li>
        <li>Still a valuable contribution!</li>
      </ul>
    </div>
    {isSelected && (
      <div className="terms-checkbox-label mt-auto pt-3">
        <TermsCheckbox type="anonymous" checked={termsAgreed} onCheckedChange={onTermsChange} />
      </div>
    )}
  </div>
);

interface ParticipationOptionsProps {
  selectedOption: 'email' | 'anonymous' | null;
  localEmail: string;
  agreedToTermsEmail: boolean;
  agreedToTermsAnonymous: boolean;
  onOptionSelect: (option: 'email' | 'anonymous') => void;
  onTermsChange: (type: 'email' | 'anonymous', checked: boolean | 'indeterminate') => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ParticipationOptions: React.FC<ParticipationOptionsProps> = ({
  selectedOption,
  localEmail,
  agreedToTermsEmail,
  agreedToTermsAnonymous,
  onOptionSelect,
  onTermsChange,
  onEmailChange,
}) => {
  return (
    <section className="space-y-6">
      <h3 className="survey-section-title !mb-4 text-center">Choose Your Participation Method:</h3>
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <EmailOptionCard
          isSelected={selectedOption === 'email'}
          isRecommended={selectedOption !== 'anonymous'}
          onSelect={() => onOptionSelect('email')}
          email={localEmail}
          onEmailChange={onEmailChange}
          termsAgreed={agreedToTermsEmail}
          onTermsChange={(checked) => onTermsChange('email', checked)}
        />
        <AnonymousOptionCard
          isSelected={selectedOption === 'anonymous'}
          onSelect={() => onOptionSelect('anonymous')}
          termsAgreed={agreedToTermsAnonymous}
          onTermsChange={(checked) => onTermsChange('anonymous', checked)}
        />
      </div>
    </section>
  );
};

export default ParticipationOptions;
