import React from "react";
import { Card } from "@radix-ui/themes";
import FooterLogin from "./components/FooterLogin";
import SignupForm from "./components/SignupForm";

export type SignupTemplateProps = {
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
    <Card style={{ maxWidth: 400, margin: "2rem auto", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>
          {t("signup.header.title")}
        </h2>
        <p style={{ color: "#666" }}>{t("signup.header.description")}</p>
      </div>
      <SignupForm
        t={t}
        signupType={signupType}
        setSignupType={setSignupType}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        businessName={businessName}
        setBusinessName={setBusinessName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        businessId={businessId}
        setBusinessId={setBusinessId}
        referralCode={referralCode}
        setReferralCode={setReferralCode}
        error={error}
        isLoading={isLoading}
        handleSignup={handleSignup}
        getPlanLabel={getPlanLabel}
      />
      <FooterLogin t={t} />
    </Card>
  );
};

export default SignupTemplate;
