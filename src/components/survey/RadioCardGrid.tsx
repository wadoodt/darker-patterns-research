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
    const otherFieldName =
      name === 'gender'
        ? 'genderOther'
        : name === 'educationLevel'
          ? 'educationOther'
          : name === 'fieldOfExpertise'
            ? 'expertiseOther'
            : '';

    const syntheticEvent = {
      target: {
        name: otherFieldName,
        value: e.target.value,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const isOtherSelected =
    hasOtherOption &&
    ((name === 'gender' && value === 'Prefer to self-describe') ||
      ((name === 'educationLevel' || name === 'fieldOfExpertise') && value === 'Other'));

  // Dynamic grid classes based on number of options and compact mode
  const getGridClasses = () => {
    if (compact) {
      // For compact mode (age group, gender), use fewer columns
      return 'grid grid-cols-1 sm:grid-cols-2 gap-3';
    } else {
      // For full-width sections with many options, use more columns
      if (options.length <= 6) {
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
      } else {
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <label className="font-medium text-gray-900">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      </div>

      <div className={getGridClasses()}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`relative flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
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
              className={`mr-3 h-4 w-4 flex-shrink-0 rounded-full border-2 ${
                value === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              } `}
            >
              {value === option.value && <div className="m-0.5 h-2 w-2 rounded-full bg-white" />}
            </div>
            <span
              className={`text-sm leading-tight ${value === option.value ? 'font-medium text-blue-900' : 'text-gray-700'}`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {hasOtherOption && isOtherSelected && (
        <div className="mt-4">
          <input
            type="text"
            value={otherValue}
            onChange={handleOtherInputChange}
            placeholder={otherPlaceholder}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default RadioCardGrid;
