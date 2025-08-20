import { Button } from '@/components/ui/button';
import { useSurveyTour } from '@/hooks/useSurveyTour';
import { Flag, Info, Map } from 'lucide-react';
import React from 'react';
import { InstructionCardProps } from './InstructionCard.types';

function InstructionCardComponent({
  instruction,
  isCurrentEvaluationSubmitted,
  setIsFlagModalOpen,
}: InstructionCardProps) {
  const { startTour } = useSurveyTour();

  return (
    <section aria-labelledby="instruction-title" className="entry-instruction-card mb-5">
      <div className="mb-1.5 flex items-center justify-between">
        <h3 id="instruction-title" className="survey-section-title flex items-center !text-base !font-semibold">
          <Info size={18} className="text-brand-purple-600 mr-1.5" />
          Instruction:
        </h3>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={startTour}
            title="Show guided tour of options"
            className="h-auto px-2 py-1 text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-600"
          >
            <Map size={12} className="mr-1" /> Options Tour
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFlagModalOpen(true)}
            title="Flag this entry for review"
            className="h-auto px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            disabled={isCurrentEvaluationSubmitted}
            data-tour="flag-button"
          >
            <Flag size={12} className="mr-1" /> Flag
          </Button>
        </div>
      </div>
      <div
        className="entry-instruction-text prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: instruction.replace(/\n/g, '<br/>') }}
      />
    </section>
  );
}
const InstructionCard = React.memo(InstructionCardComponent);
export default InstructionCard;
