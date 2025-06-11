// components/survey/DemographicsStepContent.tsx
'use client';
import type React from 'react'; // Ensure React is imported for type React.ChangeEvent
import { useState, useEffect } from 'react';
import { useSurveyProgress } from '../../contexts/SurveyProgressContext';
import type { DemographicData } from '../../types/dpo';
import { TrendingUp, Users as GenderIcon, BookOpen, Cpu, Brain, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

const DemographicsStepContent = () => {
  const {
    currentStepNumber,
    totalSteps,
    demographicsData: contextDemographicsData,
    updateDemographicsInContext, // Use this to keep context synced
    isLoadingEntries,
    error: contextError,
    setGlobalError,
    setHasUnsavedChanges, // For "unsaved changes"
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
    // Determine if there are actual changes compared to initial load or last "saved" state.
    // For simplicity, any change here marks it as unsaved until "Next" (saveDemographics) is hit.
    const hasFormChanged = Object.keys(formData).some((key) => {
      const formValue = formData[key as keyof DemographicData];
      const contextValue = contextDemographicsData ? contextDemographicsData[key as keyof DemographicData] : '';
      return formValue !== (contextValue || ''); // Compare with context or empty string
    });
    if (hasFormChanged) {
      setHasUnsavedChanges(true);
    }
  }, [formData, updateDemographicsInContext, setHasUnsavedChanges, contextDemographicsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setGlobalError(null); // Clear global error on input change

    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      if (name === 'educationLevel' && value !== 'Other') newState.educationOther = '';
      if (name === 'fieldOfExpertise' && value !== 'Other') newState.expertiseOther = '';
      if (name === 'gender' && value !== 'Prefer to self-describe') newState.genderOther = ''; // Corrected condition
      return newState;
    });
  };

  const ageGroupOptions = ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'];
  const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer to self-describe', 'Prefer not to say']; // Changed "Other"
  const educationOptions = [
    'High School or equivalent',
    'Some College (no degree)',
    "Associate's Degree",
    'Bachelor’s Degree',
    'Master’s Degree',
    'Doctoral Degree (PhD, MD, etc.)',
    'Professional Degree (JD, MBA, etc.)',
    'Other',
  ];
  const expertiseOptions = [
    'Technology / Engineering / IT (general)',
    'Computer Science / AI / Data Science / ML',
    'Social Sciences (Psychology, Sociology, etc.)',
    'Humanities (Philosophy, Arts, Literature, etc.)',
    'Healthcare / Medical',
    'Law / Policy / Government',
    'Business / Finance / Economics',
    'Education / Academia (non-CS/AI)',
    'Trades / Manufacturing / Labor',
    "Student (please specify field if possible in 'Other')",
    'Not currently employed / Homemaker',
    'Other',
  ];
  const aiFamiliarityOptions = [
    'None (no significant exposure)',
    'Basic User (e.g., occasional use of tools like ChatGPT, search engines with AI features)',
    'Regular User (e.g., frequent use of AI tools for personal or work tasks)',
    'Intermediate (understand some core concepts, can customize/prompt effectively)',
    'Advanced (actively involved in AI/ML development, research, or advanced application)',
    'Expert (leading research, architecting AI systems, deep specialization)',
  ];

  return (
    <div className="survey-page-container max-w-xl">
      <div className="survey-step-title-container mb-6 sm:mb-8">
        <p className="survey-step-indicator">
          Step {currentStepNumber} of {totalSteps}: Your Information
        </p>
        <h2 className="survey-main-title">Participant Demographics</h2>
      </div>

      <p className="font-body-academic text-light-text-secondary mb-8 text-sm leading-relaxed sm:mb-10 sm:text-base">
        This information is used for research analysis only and will be kept confidential. All fields are required
        unless marked optional.
      </p>

      {contextError && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-red-300 bg-red-100 p-3 text-xs text-red-700">
          <AlertTriangle size={16} /> {contextError}
        </div>
      )}

      <form id="demographicsFormInternal" className="space-y-7 sm:space-y-8">
        {/* Age Group */}
        <fieldset className="form-fieldset-group">
          <legend className="form-legend-light flex items-center">
            <TrendingUp size={18} className="text-brand-purple-500 mr-2" />
            Age Group:
          </legend>
          {ageGroupOptions.map((option) => (
            <label
              key={option}
              htmlFor={`ageGroup-${option.replace(/\s/g, '')}`}
              className={`form-radio-card-label-light ${formData.ageGroup === option ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="ageGroup"
                id={`ageGroup-${option.replace(/\s/g, '')}`}
                value={option}
                checked={formData.ageGroup === option}
                onChange={handleChange}
                className="form-radio-input-custom-light sr-only"
                required
                disabled={isLoadingEntries}
              />
              <span className="form-radio-label-text-light">{option}</span>
            </label>
          ))}
        </fieldset>

        {/* Gender */}
        <fieldset className="form-fieldset-group">
          <legend className="form-legend-light flex items-center">
            <GenderIcon size={18} className="text-brand-purple-500 mr-2" />
            Gender:
          </legend>
          {genderOptions.map((option) => {
            const valueId = option
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/gi, '');
            return (
              <div key={valueId}>
                <label
                  htmlFor={`gender-${valueId}`}
                  className={`form-radio-card-label-light ${formData.gender === option ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="gender"
                    id={`gender-${valueId}`}
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleChange}
                    className="form-radio-input-custom-light sr-only"
                    required
                    disabled={isLoadingEntries}
                  />
                  <span className="form-radio-label-text-light">{option}</span>
                </label>
                {option === 'Prefer to self-describe' && formData.gender === 'Prefer to self-describe' && (
                  <div className="mt-2.5 pl-[calc(0.75rem+16px+0.75rem)] sm:pl-[calc(1rem+20px+0.75rem)]">
                    <label htmlFor="genderOther" className="sr-only">
                      Please specify your gender:
                    </label>
                    <input
                      type="text"
                      name="genderOther"
                      id="genderOther"
                      className="form-input-light h-10 text-sm"
                      placeholder="Please specify"
                      value={formData.genderOther || ''}
                      onChange={handleChange}
                      required={formData.gender === 'Prefer to self-describe'}
                      disabled={isLoadingEntries}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>

        {/* Education Level */}
        <fieldset className="form-fieldset-group">
          <legend className="form-legend-light flex items-center">
            <BookOpen size={18} className="text-brand-purple-500 mr-2" />
            Highest Education Level Attained:
          </legend>
          {educationOptions.map((option) => {
            const valueId = option
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/gi, '');
            return (
              <div key={option}>
                <label
                  htmlFor={`education-${valueId}`}
                  className={`form-radio-card-label-light ${formData.educationLevel === option ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="educationLevel"
                    id={`education-${valueId}`}
                    value={option}
                    checked={formData.educationLevel === option}
                    onChange={handleChange}
                    className="form-radio-input-custom-light sr-only"
                    required
                    disabled={isLoadingEntries}
                  />
                  <span className="form-radio-label-text-light">{option}</span>
                </label>
                {option === 'Other' && formData.educationLevel === 'Other' && (
                  <div className="mt-2.5 pl-[calc(0.75rem+16px+0.75rem)] sm:pl-[calc(1rem+20px+0.75rem)]">
                    <label htmlFor="educationOther" className="sr-only">
                      Please specify other education:
                    </label>
                    <input
                      type="text"
                      name="educationOther"
                      id="educationOther"
                      className="form-input-light h-10 text-sm"
                      placeholder="Please specify"
                      value={formData.educationOther || ''}
                      onChange={handleChange}
                      required={formData.educationLevel === 'Other'}
                      disabled={isLoadingEntries}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>

        {/* Field of Expertise */}
        <fieldset className="form-fieldset-group">
          <legend className="form-legend-light flex items-center">
            <Cpu size={18} className="text-brand-purple-500 mr-2" />
            Primary Field of Expertise / Occupation:
          </legend>
          {expertiseOptions.map((option) => {
            const valueId = option
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/gi, '');
            return (
              <div key={option}>
                <label
                  htmlFor={`expertise-${valueId}`}
                  className={`form-radio-card-label-light ${formData.fieldOfExpertise === option ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="fieldOfExpertise"
                    id={`expertise-${valueId}`}
                    value={option}
                    checked={formData.fieldOfExpertise === option}
                    onChange={handleChange}
                    className="form-radio-input-custom-light sr-only"
                    required
                    disabled={isLoadingEntries}
                  />
                  <span className="form-radio-label-text-light">{option}</span>
                </label>
                {option === 'Other' && formData.fieldOfExpertise === 'Other' && (
                  <div className="mt-2.5 pl-[calc(0.75rem+16px+0.75rem)] sm:pl-[calc(1rem+20px+0.75rem)]">
                    <label htmlFor="expertiseOther" className="sr-only">
                      Please specify other expertise:
                    </label>
                    <input
                      type="text"
                      name="expertiseOther"
                      id="expertiseOther"
                      className="form-input-light h-10 text-sm"
                      placeholder="Please specify field or role"
                      value={formData.expertiseOther || ''}
                      onChange={handleChange}
                      required={formData.fieldOfExpertise === 'Other'}
                      disabled={isLoadingEntries}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>

        {/* AI Familiarity */}
        <fieldset className="form-fieldset-group">
          <legend className="form-legend-light flex items-center">
            <Brain size={18} className="text-brand-purple-500 mr-2" />
            Level of Familiarity with AI/LLMs (e.g., ChatGPT, Gemini, Copilot):
          </legend>
          {aiFamiliarityOptions.map((option) => {
            const valueId = option
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/gi, '');
            return (
              <label
                key={option}
                htmlFor={`aiFamiliarity-${valueId}`}
                className={`form-radio-card-label-light ${formData.aiFamiliarity === option ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="aiFamiliarity"
                  id={`aiFamiliarity-${valueId}`}
                  value={option}
                  checked={formData.aiFamiliarity === option}
                  onChange={handleChange}
                  className="form-radio-input-custom-light sr-only"
                  required
                  disabled={isLoadingEntries}
                />
                <span className="form-radio-label-text-light">{option}</span>
              </label>
            );
          })}
        </fieldset>
      </form>
    </div>
  );
};

export default DemographicsStepContent;
