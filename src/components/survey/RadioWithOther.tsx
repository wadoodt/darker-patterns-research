import { type LucideIcon } from 'lucide-react';

interface RadioWithOtherProps {
  options: string[];
  name: string;
  value: string | null | undefined;
  otherValue: string | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  otherInputPlaceholder?: string;
}

const RadioWithOther = ({
  options,
  name,
  value,
  otherValue,
  onChange,
  icon: Icon,
  label,
  disabled = false,
  otherInputPlaceholder = 'Please specify',
}: RadioWithOtherProps) => {
  const isOtherSelected = value === 'Other' || value === 'Prefer to self-describe';
  const otherFieldName = `${name}Other`;

  return (
    <fieldset className="form-fieldset-group">
      <legend className="form-legend-light flex items-center">
        <Icon size={18} className="text-brand-purple-500 mr-2" />
        {label}
      </legend>
      {options.map((option) => {
        const valueId = option
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/gi, '');
        return (
          <div key={valueId}>
            <label
              htmlFor={`${name}-${valueId}`}
              className={`form-radio-card-label-light ${value === option ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={name}
                id={`${name}-${valueId}`}
                value={option}
                checked={value === option}
                onChange={onChange}
                className="form-radio-input-custom-light sr-only"
                required
                disabled={disabled}
              />
              <span className="form-radio-label-text-light">{option}</span>
            </label>
            {(option === 'Other' || option === 'Prefer to self-describe') && isOtherSelected && (
              <div className="mt-2.5 pl-[calc(0.75rem+16px+0.75rem)] sm:pl-[calc(1rem+20px+0.75rem)]">
                <label htmlFor={otherFieldName} className="sr-only">
                  Please specify {name}:
                </label>
                <input
                  type="text"
                  name={otherFieldName}
                  id={otherFieldName}
                  className="form-input-light h-10 text-sm"
                  placeholder={otherInputPlaceholder}
                  value={otherValue || ''}
                  onChange={onChange}
                  required={isOtherSelected}
                  disabled={disabled}
                />
              </div>
            )}
          </div>
        );
      })}
    </fieldset>
  );
};

export default RadioWithOther;
