import { type LucideIcon } from 'lucide-react';

interface SimpleRadioGroupProps {
  options: string[];
  name: string;
  value: string | null | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
}

const SimpleRadioGroup = ({
  options,
  name,
  value,
  onChange,
  icon: Icon,
  label,
  disabled = false,
}: SimpleRadioGroupProps) => {
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
          <label
            key={option}
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
        );
      })}
    </fieldset>
  );
};

export default SimpleRadioGroup;
