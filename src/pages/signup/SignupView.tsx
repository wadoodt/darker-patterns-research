
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SignupTemplate from "./SignupTemplate";
import { useSignup } from "@api/domains/signup/hooks";

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
  const { mutate: signup, isLoading } = useSignup();

  useEffect(() => {
    if (signupType === "new" && !selectedPlan) {
      setError(t("auth.signup.alerts.error.selectPlan"));
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
    setError(null);

    if (password !== confirmPassword) {
      setError(t("auth.signup.alerts.error.passwordMismatch"));
      return;
    }

    signup(
      {
        action: "create",
        companyName: businessName,
        name: `${firstName} ${lastName}`,
        email,
        password,
        plan: selectedPlan,
      },
      {
        onSuccess: () => {
          window.location.href = "/dashboard";
        },
        onError: (err) => {
          setError((err as Error).message);
        },
      },
    );
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
