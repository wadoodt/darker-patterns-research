import type React from 'react';
import type { DemographicData } from '../../types/dpo';
import DemographicsFields from './DemographicsFields';
import DemographicsHeader from './DemographicsHeader';
import ErrorMessage from './ErrorMessage';

interface DemographicsFormProps {
  formData: DemographicData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoadingEntries: boolean;
  currentStepNumber: number;
  totalSteps: number;
  contextError: string | null;
}

const DemographicsForm = ({
  formData,
  onChange,
  isLoadingEntries,
  currentStepNumber,
  totalSteps,
  contextError,
}: DemographicsFormProps) => {
  return (
    <div className="survey-page-container max-w-xl">
      <DemographicsHeader currentStepNumber={currentStepNumber} totalSteps={totalSteps} />
      <p className="font-body-academic text-light-text-secondary mb-8 text-sm leading-relaxed sm:mb-10 sm:text-base">
        This information is used for research analysis only and will be kept confidential. All fields are required
        unless marked optional.
      </p>
      <ErrorMessage error={contextError} />
      <DemographicsFields formData={formData} onChange={onChange} isLoadingEntries={isLoadingEntries} />
    </div>
  );
};

export default DemographicsForm;
