import React from 'react';
import { Card } from '@radix-ui/themes';
import SignupTypeSelector from './components/SignupTypeSelector';
import PlanSelect from './components/PlanSelect';
import NameFields from './components/NameFields';
import BusinessFields from './components/BusinessFields';
import InfoAlert from './components/InfoAlert';
import ErrorAlert from './components/ErrorAlert';
import FooterLogin from './components/FooterLogin';

export type SignupTemplateProps = {
  t: (key: string, options?: Record<string, unknown>) => string;
  signupType: 'new' | 'existing';
  setSignupType: (type: 'new' | 'existing') => void;
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  businessName: string;
  setBusinessName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  businessId: string;
  setBusinessId: (v: string) => void;
  referralCode: string;
  setReferralCode: (v: string) => void;
  error: string | null;
  isLoading: boolean;
  handleSignup: (e: React.FormEvent) => void;
  getPlanLabel: (planKey: string) => string;
};

const SignupTemplate: React.FC<SignupTemplateProps> = (props) => {
  const {
    t,
    signupType,
    setSignupType,
    selectedPlan,
    setSelectedPlan,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    businessName,
    setBusinessName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    businessId,
    setBusinessId,
    referralCode,
    setReferralCode,
    error,
    isLoading,
    handleSignup,
    getPlanLabel,
  } = props;

  return (
    <Card style={{ maxWidth: 400, margin: '2rem auto', padding: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{t('signup.header.title')}</h2>
        <p style={{ color: '#666' }}>{t('signup.header.description')}</p>
      </div>
      <form onSubmit={handleSignup}>
        <SignupTypeSelector signupType={signupType} setSignupType={setSignupType} t={t} />
        {signupType === 'new' && (
          <PlanSelect selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} getPlanLabel={getPlanLabel} />
        )}
        <NameFields firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} t={t} />
        <BusinessFields signupType={signupType} businessName={businessName} setBusinessName={setBusinessName} businessId={businessId} setBusinessId={setBusinessId} referralCode={referralCode} setReferralCode={setReferralCode} t={t} />
        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">{t('signup.form.labels.email')}</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">{t('signup.form.labels.password')}</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        {/* Confirm Password */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="confirmPassword">{t('signup.form.labels.confirmPassword')}</label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>
        <InfoAlert show={signupType === 'new' && !!selectedPlan} selectedPlan={selectedPlan} getPlanLabel={getPlanLabel} t={t} />
        <ErrorAlert error={error} t={t} />
        <button
          type="submit"
          style={{ width: '100%', padding: 12, borderRadius: 6, background: '#111', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: 8 }}
          disabled={isLoading || (signupType === 'new' && !selectedPlan)}
        >
          {isLoading
            ? t('signup.buttons.signingUp')
            : signupType === 'new'
            ? t('signup.buttons.createAccount')
            : t('signup.buttons.joinBusiness')}
        </button>
      </form>
      <FooterLogin t={t} />
    </Card>
  );
};

export default SignupTemplate; 