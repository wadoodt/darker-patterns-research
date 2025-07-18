import React from 'react';
import { UserPlus, Building } from 'lucide-react';

type SignupType = 'new' | 'existing';

type SignupTypeSelectorProps = {
  signupType: SignupType;
  setSignupType: (type: SignupType) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const SignupTypeSelector: React.FC<SignupTypeSelectorProps> = ({ signupType, setSignupType, t }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontWeight: 500 }}>{t('signup.form.typeLabel')}</label>
    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
      <label style={{ flex: 1, cursor: 'pointer', border: signupType === 'new' ? '2px solid #111' : '1px solid #ccc', borderRadius: 8, padding: 12, textAlign: 'center' }}>
        <input
          type="radio"
          name="signupType"
          value="new"
          checked={signupType === 'new'}
          onChange={() => setSignupType('new')}
          style={{ display: 'none' }}
        />
        <UserPlus style={{ marginBottom: 4 }} />
        <div>{t('signup.form.options.new')}</div>
      </label>
      <label style={{ flex: 1, cursor: 'pointer', border: signupType === 'existing' ? '2px solid #111' : '1px solid #ccc', borderRadius: 8, padding: 12, textAlign: 'center' }}>
        <input
          type="radio"
          name="signupType"
          value="existing"
          checked={signupType === 'existing'}
          onChange={() => setSignupType('existing')}
          style={{ display: 'none' }}
        />
        <Building style={{ marginBottom: 4 }} />
        <div>{t('signup.form.options.existing')}</div>
      </label>
    </div>
  </div>
);

export default SignupTypeSelector; 