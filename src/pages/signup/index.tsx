import React, { useEffect, useState } from "react";
import SignupView from "./SignupView";
import { useAuth } from "@hooks/useAuth";

function getPlanFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("plan");
}

const SignupIndex: React.FC = () => {
  const [selectedPlanParams, setSelectedPlanParams] = useState<string | null>(
    null,
  );
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = "/dashboard";
    }
    setSelectedPlanParams(getPlanFromUrl());
  }, [user]);

  return <SignupView selectedPlanParams={selectedPlanParams} />;
};

export default SignupIndex;
