import React, { useEffect, useState } from 'react';
import SignupView from './SignupView';

function getPlanFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('plan');
}

const SignupIndex: React.FC = () => {
  const [selectedPlanParams, setSelectedPlanParams] = useState<string | null>(null);
  useEffect(() => {
    setSelectedPlanParams(getPlanFromUrl());
  }, []);
  return <SignupView selectedPlanParams={selectedPlanParams} />;
};

export default SignupIndex; 