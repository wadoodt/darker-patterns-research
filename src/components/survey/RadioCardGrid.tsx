import type { LucideIcon } from 'lucide-react';
import type React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioCardGridProps {
  options: RadioOption[];
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  required?: boolean;
  hasOtherOption?: boolean;
  otherValue?: string;
  otherPlaceholder?: string;
  compact?: boolean;
}

// Utility functions outside the component to reduce component complexity
const getOtherFieldName = (fieldName: string): string => {
  const otherFieldNameMap: Record<string, string> = {
    gender: 'genderOther',
    educationLevel: 'educationOther',
    fieldOfExpertise: 'expertiseOther',
  };

  return otherFieldNameMap[fieldName] || '';
};

const getGridClasses = (compact: boolean, optionsLength: number): string => {
  if (compact) {
    // For compact mode (age group, gender), use fewer columns
    return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
  } else {
    // For full-width sections with many options, use more columns
    if (optionsLength <= 6) {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
    } else {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';
    }
  }
};

const isOtherOptionSelected = (name: string, value: string, hasOtherOption: boolean): boolean => {
  return (
    hasOtherOption &&
    ((name === 'gender' && value === 'Prefer to self-describe') ||
      ((name === 'educationLevel' || name === 'fieldOfExpertise') && value === 'Other'))
  );
};

// Separate components for cleaner organization
const RadioCardLabel = ({ Icon, label, required }: { Icon: LucideIcon; label: string; required: boolean }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-5 w-5 text-blue-600" />
    <label className="font-medium text-gray-900">
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  </div>
);

// Radio option component
const RadioOption = ({
  option,
  name,
  value,
  onChange,
  disabled,
  compact,
}: {
  option: RadioOption;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  compact: boolean;
}) => (
  <label
    key={option.value}
    className={`relative flex cursor-pointer items-center rounded-lg border p-3 transition-all duration-200 ease-in-out ${
      value === option.value
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
        : 'border-gray-300 bg-white hover:border-gray-400'
    } ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${compact ? 'min-h-[3rem]' : 'min-h-[3.5rem]'} `}
  >
    <input
      type="radio"
      name={name}
      value={option.value}
      checked={value === option.value}
      onChange={onChange}
      disabled={disabled}
      className="sr-only"
    />
    <div
      className={`mr-3 h-4 w-4 flex-shrink-0 rounded-full border-2 transition-colors duration-200 ease-in-out ${
        value === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
      } `}
    >
      {value === option.value && <div className="m-0.5 h-2 w-2 rounded-full bg-white" />}
    </div>
    <span
      className={`text-sm leading-tight transition-colors duration-200 ease-in-out ${value === option.value ? 'font-medium text-blue-900' : 'text-gray-700'}`}
    >
      {option.label}
    </span>
  </label>
);

// Other input component
const OtherInput = ({
  hasOtherOption,
  isOtherSelected,
  otherValue,
  otherPlaceholder,
  disabled,
  handleChange,
}: {
  hasOtherOption: boolean;
  isOtherSelected: boolean;
  otherValue: string;
  otherPlaceholder: string;
  disabled: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div
    className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${hasOtherOption && isOtherSelected ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}
  >
    {hasOtherOption && (
      <input
        type="text"
        value={otherValue}
        onChange={handleChange}
        placeholder={otherPlaceholder}
        disabled={disabled || !isOtherSelected}
        className="w-full rounded-lg border border-gray-300 p-3 transition-all duration-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />
    )}
  </div>
);

const RadioCardGrid = ({
  options,
  name,
  value,
  onChange,
  icon: Icon,
  label,
  disabled = false,
  required = false,
  hasOtherOption = false,
  otherValue = '',
  otherPlaceholder = 'Please specify',
  compact = false,
}: RadioCardGridProps) => {
  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const otherFieldName = getOtherFieldName(name);
    if (!otherFieldName) return;

    const syntheticEvent = {
      target: {
        name: otherFieldName,
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    requestAnimationFrame(() => {
      onChange(syntheticEvent);
    });
  };

  const isOtherSelected = isOtherOptionSelected(name, value, hasOtherOption);
  const gridClassName = getGridClasses(compact, options.length);

  return (
    <div className="space-y-4">
      <RadioCardLabel Icon={Icon} label={label} required={required} />

      <div className={gridClassName}>
        {options.map((option) => (
          <RadioOption
            key={option.value}
            option={option}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            compact={compact}
          />
        ))}
      </div>

      <OtherInput
        hasOtherOption={hasOtherOption}
        isOtherSelected={isOtherSelected}
        otherValue={otherValue}
        otherPlaceholder={otherPlaceholder}
        disabled={disabled}
        handleChange={handleOtherInputChange}
      />
    </div>
  );
};

export default RadioCardGrid;
