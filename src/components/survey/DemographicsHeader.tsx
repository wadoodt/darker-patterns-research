interface DemographicsHeaderProps {
  currentStepNumber: number;
  totalSteps: number;
}

const DemographicsHeader = ({ currentStepNumber, totalSteps }: DemographicsHeaderProps) => {
  return (
    <div className="survey-step-title-container mb-6 sm:mb-8">
      <p className="survey-step-indicator">
        Step {currentStepNumber} of {totalSteps}: Your Information
      </p>
      <h2 className="survey-main-title">Participant Demographics</h2>
    </div>
  );
};

export default DemographicsHeader;
