import { BookOpen, Brain, Cpu, Users as GenderIcon, TrendingUp } from 'lucide-react';
import type React from 'react';
import {
  ageGroupOptions,
  aiFamiliarityOptions,
  educationOptions,
  expertiseOptions,
  genderOptions,
} from '../../lib/survey/demographicsOptions';
import type { DemographicData } from '../../types/dpo';
import RadioWithOther from './RadioWithOther';
import SimpleRadioGroup from './SimpleRadioGroup';

interface DemographicsFieldsProps {
  formData: DemographicData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isLoadingEntries: boolean;
}

const DemographicsFields = ({ formData, onChange, isLoadingEntries }: DemographicsFieldsProps) => {
  return (
    <form id="demographicsFormInternal" className="space-y-7 sm:space-y-8">
      <SimpleRadioGroup
        options={ageGroupOptions}
        name="ageGroup"
        value={formData.ageGroup || ''}
        onChange={onChange}
        icon={TrendingUp}
        label="Age Group:"
        disabled={isLoadingEntries}
      />

      <RadioWithOther
        options={genderOptions}
        name="gender"
        value={formData.gender || ''}
        otherValue={formData.genderOther || ''}
        onChange={onChange}
        icon={GenderIcon}
        label="Gender:"
        disabled={isLoadingEntries}
        otherInputPlaceholder="Please specify your gender"
      />

      <RadioWithOther
        options={educationOptions}
        name="educationLevel"
        value={formData.educationLevel || ''}
        otherValue={formData.educationOther || ''}
        onChange={onChange}
        icon={BookOpen}
        label="Highest Education Level Attained:"
        disabled={isLoadingEntries}
      />

      <RadioWithOther
        options={expertiseOptions}
        name="fieldOfExpertise"
        value={formData.fieldOfExpertise || ''}
        otherValue={formData.expertiseOther || ''}
        onChange={onChange}
        icon={Cpu}
        label="Primary Field of Expertise / Occupation:"
        disabled={isLoadingEntries}
        otherInputPlaceholder="Please specify field or role"
      />

      <SimpleRadioGroup
        options={aiFamiliarityOptions}
        name="aiFamiliarity"
        value={formData.aiFamiliarity || ''}
        onChange={onChange}
        icon={Brain}
        label="Level of Familiarity with AI/LLMs (e.g., ChatGPT, Gemini, Copilot):"
        disabled={isLoadingEntries}
      />
    </form>
  );
};

export default DemographicsFields;
