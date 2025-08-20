// components/survey/DemographicsStepContent.tsx
'use client';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import type { DemographicData } from '../../types/dpo';
import DemographicsForm from './DemographicsForm';

const DemographicsStepContent = () => {
  const {
    currentStepNumber,
    totalSteps,
    demographicsData: contextDemographicsData,
    updateDemographicsInContext,
    isLoadingEntries,
    error: contextError,
    setGlobalError,
    setHasUnsavedChanges,
  } = useSurveyProgress();

  const [formData, setFormData] = useState<DemographicData>(() => {
    return (
      contextDemographicsData || {
        ageGroup: '',
        gender: '',
        genderOther: '',
        educationLevel: '',
        educationOther: '',
        fieldOfExpertise: '',
        expertiseOther: '',
        aiFamiliarity: '',
      }
    );
  });

  // Sync local state with context if context changes (e.g., navigating back)
  useEffect(() => {
    if (contextDemographicsData) {
      setFormData(contextDemographicsData);
    }
  }, [contextDemographicsData]);

  // Update context whenever local formData changes
  useEffect(() => {
    updateDemographicsInContext(formData);
    // Determine if there are actual changes compared to initial load or last "saved" state
    const hasFormChanged = Object.keys(formData).some((key) => {
      const formValue = formData[key as keyof DemographicData];
      const contextValue = contextDemographicsData ? contextDemographicsData[key as keyof DemographicData] : '';
      return formValue !== (contextValue || '');
    });
    if (hasFormChanged) {
      setHasUnsavedChanges(true);
    }
  }, [formData, updateDemographicsInContext, setHasUnsavedChanges, contextDemographicsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGlobalError(null); // Clear global error on input change

    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'educationLevel' && value !== 'Other') newState.educationOther = '';
      if (name === 'fieldOfExpertise' && value !== 'Other') newState.expertiseOther = '';
      if (name === 'gender' && value !== 'Prefer to self-describe') newState.genderOther = '';
      return newState;
    });
  };

  return (
    <DemographicsForm
      formData={formData}
      onChange={handleChange}
      isLoadingEntries={isLoadingEntries}
      currentStepNumber={currentStepNumber}
      totalSteps={totalSteps}
      contextError={contextError}
    />
  );
};

export default DemographicsStepContent;
