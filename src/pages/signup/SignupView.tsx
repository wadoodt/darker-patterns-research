import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SignupTemplate from "./SignupTemplate";

type SignupType = "new" | "existing";

type SignupViewProps = {
  selectedPlanParams: string | null;
};

const SignupView: React.FC<SignupViewProps> = ({ selectedPlanParams }) => {
  const { t } = useTranslation();
  const [signupType, setSignupType] = useState<SignupType>("new");
  const [selectedPlan, setSelectedPlan] = useState<string>(
    selectedPlanParams || "business",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (signupType === "new" && !selectedPlan) {
      setError(t("signup.alerts.error.selectPlan"));
    } else {
      setError(null);
    }
  }, [signupType, selectedPlan, t]);

  const getPlanLabel = (planKey: string) => {
    switch (planKey) {
      case "business":
        return t("pricing.plans.business.title");
      case "premium":
        return t("pricing.plans.premium.title");
      case "custom":
        return t("pricing.plans.custom.title");
      default:
        return planKey;
    }
  };

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setError(t("signup.alerts.error.passwordMismatch"));
      setIsLoading(false);
      return;
    }
    try {
      // TODO: Integrate with real backend user creation and Stripe session creation
      // For now, simulate payment session creation with the mock API
      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: "comp-001", // TODO: Replace with actual companyId from signup
          userId: "user-001", // TODO: Replace with actual userId from signup
          amount:
            selectedPlan === "business"
              ? 9900
              : selectedPlan === "premium"
                ? 24900
                : 0, // Example pricing
          currency: "usd",
        }),
      });
      await paymentRes.json();
      // TODO: When backend is ready, redirect to paymentData.stripeUrl for real Stripe onboarding
      window.location.href = "/success";
    } catch {
      setError(t("signup.alerts.error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignupTemplate
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
  );
};

export default SignupView;
