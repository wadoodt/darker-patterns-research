const ProgressBar = () => {
  // Basic placeholder, real progress will come from context
  const currentStep = 2;
  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-light-bg-tertiary sticky top-0 z-[70] h-1.5 w-full">
      <div
        className="bg-brand-purple-500 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};
export default ProgressBar;
