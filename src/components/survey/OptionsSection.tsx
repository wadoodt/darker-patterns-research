import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface Option {
  key: 'A' | 'B';
  content: string;
  isDatasetAccepted: boolean;
}

export interface OptionsSectionProps {
  options: Option[];
  selectedOptionKey: 'A' | 'B' | null;
  isCurrentEvaluationSubmitted: boolean;
  handleOptionSelect: (optionKey: 'A' | 'B') => void;
  userChoseCorrectlyIfRevealed: boolean;
}

export default function OptionsSection({
  options,
  selectedOptionKey,
  isCurrentEvaluationSubmitted,
  handleOptionSelect,
  userChoseCorrectlyIfRevealed,
}: OptionsSectionProps) {
  return (
    <section aria-labelledby="options-title" className="mb-5">
      <h3 id="options-title" className="survey-section-title mb-3 text-center !text-base !font-semibold">
        Which response do you prefer for the instruction above?
      </h3>
      <div className="option-selection-container">
        {options.map((opt: Option) => (
          <div
            key={opt.key}
            onClick={() => !isCurrentEvaluationSubmitted && handleOptionSelect(opt.key)}
            className={cn(
              'option-card-button flex flex-col',
              selectedOptionKey === opt.key && !isCurrentEvaluationSubmitted && 'selected',
              isCurrentEvaluationSubmitted && 'cursor-not-allowed opacity-80',
              isCurrentEvaluationSubmitted &&
                selectedOptionKey === opt.key &&
                userChoseCorrectlyIfRevealed &&
                'border-green-500 ring-2 ring-green-500',
              isCurrentEvaluationSubmitted &&
                selectedOptionKey === opt.key &&
                !userChoseCorrectlyIfRevealed &&
                'border-red-500 ring-2 ring-red-500',
            )}
            role="button"
            tabIndex={isCurrentEvaluationSubmitted ? -1 : 0}
            aria-pressed={selectedOptionKey === opt.key}
          >
            <span className="option-card-label">Option {opt.key}</span>
            <div
              className="option-card-content prose prose-sm max-w-none flex-grow text-gray-700"
              dangerouslySetInnerHTML={{ __html: opt.content.replace(/\n/g, '<br/>') }}
            />
            {isCurrentEvaluationSubmitted && selectedOptionKey === opt.key && (
              <div
                className={cn(
                  'reveal-status-badge -mx-3 mt-auto -mb-3 flex items-center justify-center gap-1.5 rounded-b-md py-1.5 pt-2 text-xs font-medium',
                  opt.isDatasetAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                )}
              >
                {opt.isDatasetAccepted ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                Researchers&apos; {opt.isDatasetAccepted ? 'Preferred' : 'Less Preferred'} Choice
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
