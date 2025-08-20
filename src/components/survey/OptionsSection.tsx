import { cn } from '@/lib/utils';
import type { DPOOption } from '@/types/dpo';
import { CheckCircle2, XCircle } from 'lucide-react';
import { OptionsSectionProps } from './OptionsSection.types';

export default function OptionsSection({
  options,
  selectedOptionKey,
  handleOptionSelect,
  isUIBlocked,
  isRevealed,
  researcherOptionKey,
}: OptionsSectionProps) {
  return (
    <section aria-labelledby="options-title" className="mb-5">
      <h3 id="options-title" className="survey-section-title mb-3 text-center !text-base !font-semibold">
        Which response do you prefer for the instruction above?
      </h3>
      <div className="option-selection-container">
        {options.map((opt: DPOOption) => {
          const isSelected = selectedOptionKey === opt.key;
          const isResearcherChoice = opt.key === researcherOptionKey;

          return (
            <div
              key={opt.key}
              onClick={() => !isUIBlocked && handleOptionSelect(opt.key)}
              className={cn(
                'option-card-button flex flex-col',
                isSelected && !isRevealed && 'selected',
                isUIBlocked && 'cursor-not-allowed opacity-80',
                isRevealed && isSelected && isResearcherChoice && 'border-green-500 ring-2 ring-green-500',
                isRevealed && isSelected && !isResearcherChoice && 'border-red-500 ring-2 ring-red-500',
              )}
              role="button"
              tabIndex={isUIBlocked ? -1 : 0}
              aria-pressed={selectedOptionKey === opt.key}
            >
              <span className="option-card-label">Option {opt.key}</span>
              <div
                className="option-card-content prose prose-sm max-w-none flex-grow text-gray-700"
                dangerouslySetInnerHTML={{ __html: opt.content.replace(/\n/g, '<br/>') }}
              />
              {isRevealed && (
                <div
                  className={cn(
                    'reveal-status-badge -mx-3 mt-auto -mb-3 flex items-center justify-center gap-1.5 rounded-b-md py-1.5 pt-2 text-xs font-medium',
                    isResearcherChoice ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                  )}
                >
                  {isResearcherChoice ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  Researchers&apos; {isResearcherChoice ? 'Preferred' : 'Less Preferred'} Choice
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
