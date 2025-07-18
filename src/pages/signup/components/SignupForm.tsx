import React from "react";
import SignupTypeSelector from "./SignupTypeSelector";
import PlanSelect from "./PlanSelect";
import NameFields from "./NameFields";
import BusinessFields from "./BusinessFields";
import InfoAlert from "./InfoAlert";
import ErrorAlert from "./ErrorAlert";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";
import ConfirmPasswordField from "./ConfirmPasswordField";
import SignupSubmitButton from "./SignupSubmitButton";

export type SignupFormProps = {
  t: (key: string, options?: Record<string, unknown>) => string;
  signupType: "new" | "existing";
  setSignupType: (type: "new" | "existing") => void;
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

const SignupForm: React.FC<SignupFormProps> = ({
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
}) => (
  <form onSubmit={handleSignup}>
    <SignupTypeSelector
      signupType={signupType}
      setSignupType={setSignupType}
      t={t}
    />
    {signupType === "new" && (
      <PlanSelect
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        getPlanLabel={getPlanLabel}
      />
    )}
    <NameFields
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      t={t}
    />
    <BusinessFields
      signupType={signupType}
      businessName={businessName}
      setBusinessName={setBusinessName}
      businessId={businessId}
      setBusinessId={setBusinessId}
      referralCode={referralCode}
      setReferralCode={setReferralCode}
      t={t}
    />
    <EmailField
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      t={t}
      disabled={isLoading}
    />
    <PasswordField
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      t={t}
      disabled={isLoading}
    />
    <ConfirmPasswordField
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      t={t}
      disabled={isLoading}
    />
    <InfoAlert
      show={signupType === "new" && !!selectedPlan}
      selectedPlan={selectedPlan}
      getPlanLabel={getPlanLabel}
      t={t}
    />
    <ErrorAlert error={error} t={t} />
    <SignupSubmitButton
      isLoading={isLoading}
      signupType={signupType}
      selectedPlan={selectedPlan}
      t={t}
    />
  </form>
);

export default SignupForm;
