import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Award, Mail, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

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
        {/* Email Option Card */}
        <div
          onClick={() => onOptionSelect('email')}
          className={`auth-option-card-survey ${selectedOption === 'email' ? 'selected' : ''} ${selectedOption !== 'anonymous' ? 'recommended' : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOptionSelect('email')}
        >
          {selectedOption !== 'anonymous' && (
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
          {selectedOption === 'email' && (
            <div className="mt-auto space-y-2 pt-3">
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={localEmail}
                onChange={onEmailChange}
                className="form-input-light h-9 text-xs"
                required
              />
              <div className="terms-checkbox-label">
                <Checkbox
                  id="termsEmail"
                  checked={agreedToTermsEmail}
                  onCheckedChange={(checked) => onTermsChange('email', checked)}
                  className="form-checkbox-custom-light"
                />
                <label htmlFor="termsEmail" className="ml-2 text-xs">
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
            </div>
          )}
        </div>

        {/* Anonymous Option Card */}
        <div
          onClick={() => onOptionSelect('anonymous')}
          className={`auth-option-card-survey ${selectedOption === 'anonymous' ? 'selected' : ''}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOptionSelect('anonymous')}
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
          {selectedOption === 'anonymous' && (
            <div className="terms-checkbox-label mt-auto pt-3">
              <Checkbox
                id="termsAnonymous"
                checked={agreedToTermsAnonymous}
                onCheckedChange={(checked) => onTermsChange('anonymous', checked)}
                className="form-checkbox-custom-light"
              />
              <label htmlFor="termsAnonymous" className="ml-2 text-xs">
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
          )}
        </div>
      </div>
    </section>
  );
};

export default ParticipationOptions;
