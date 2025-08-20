import { BookOpen, Brain, Cpu, Users as GenderIcon, TrendingUp } from 'lucide-react';
import React from 'react';
import {
  ageGroupOptions,
  aiFamiliarityOptions,
  educationOptions,
  expertiseOptions,
  genderOptions,
} from '../../lib/survey/demographicsOptions';
import type { DemographicData } from '../../types/dpo';
import RadioCardGrid from './RadioCardGrid';

interface DemographicsFieldsProps {
  formData: DemographicData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoadingEntries: boolean;
}

const AgeAndGenderSection = ({ formData, onChange, isLoadingEntries }: DemographicsFieldsProps) => (
  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
    <RadioCardGrid
      options={ageGroupOptions.map((option) => ({ value: option, label: `${option} years old` }))}
      name="ageGroup"
      value={formData.ageGroup || ''}
      onChange={onChange}
      icon={TrendingUp}
      label="Age Group"
      disabled={isLoadingEntries}
      required
      compact
    />
    <RadioCardGrid
      options={genderOptions.map((option) => ({ value: option, label: option }))}
      name="gender"
      value={formData.gender || ''}
      onChange={onChange}
      icon={GenderIcon}
      label="Gender"
      disabled={isLoadingEntries}
      required
      hasOtherOption
      otherValue={formData.genderOther || ''}
      otherPlaceholder="Please specify your gender"
      compact
    />
  </div>
);

const EducationSection = ({ formData, onChange, isLoadingEntries }: DemographicsFieldsProps) => (
  <RadioCardGrid
    options={educationOptions.map((option) => ({ value: option, label: option }))}
    name="educationLevel"
    value={formData.educationLevel || ''}
    onChange={onChange}
    icon={BookOpen}
    label="Highest Education Level Attained"
    disabled={isLoadingEntries}
    required
    hasOtherOption
    otherValue={formData.educationOther || ''}
    otherPlaceholder="Please specify your education level"
  />
);

const ExpertiseSection = ({ formData, onChange, isLoadingEntries }: DemographicsFieldsProps) => (
  <RadioCardGrid
    options={expertiseOptions.map((option) => ({ value: option, label: option }))}
    name="fieldOfExpertise"
    value={formData.fieldOfExpertise || ''}
    onChange={onChange}
    icon={Cpu}
    label="Primary Field of Expertise / Occupation"
    disabled={isLoadingEntries}
    required
    hasOtherOption
    otherValue={formData.expertiseOther || ''}
    otherPlaceholder="Please specify field or role"
  />
);

const AiFamiliaritySection = ({ formData, onChange, isLoadingEntries }: DemographicsFieldsProps) => (
  <RadioCardGrid
    options={aiFamiliarityOptions.map((option) => ({ value: option, label: option }))}
    name="aiFamiliarity"
    value={formData.aiFamiliarity || ''}
    onChange={onChange}
    icon={Brain}
    label="Level of Familiarity with AI/LLMs (e.g., ChatGPT, Gemini, Copilot)"
    disabled={isLoadingEntries}
    required
  />
);

const DemographicsFields = ({ formData, onChange, isLoadingEntries }: DemographicsFieldsProps) => {
  return (
    <form id="demographicsFormInternal" className="space-y-8">
      <AgeAndGenderSection formData={formData} onChange={onChange} isLoadingEntries={isLoadingEntries} />
      <EducationSection formData={formData} onChange={onChange} isLoadingEntries={isLoadingEntries} />
      <ExpertiseSection formData={formData} onChange={onChange} isLoadingEntries={isLoadingEntries} />
      <AiFamiliaritySection formData={formData} onChange={onChange} isLoadingEntries={isLoadingEntries} />
    </form>
  );
};

export default DemographicsFields;
