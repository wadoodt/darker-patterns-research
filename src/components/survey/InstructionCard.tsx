import { Button } from '@/components/ui/button';
import { Flag, Info } from 'lucide-react';

export interface InstructionCardProps {
  instruction: string;
  isCurrentEvaluationSubmitted: boolean;
  setIsFlagModalOpen: (open: boolean) => void;
}

export default function InstructionCard({
  instruction,
  isCurrentEvaluationSubmitted,
  setIsFlagModalOpen,
}: InstructionCardProps) {
  return (
    <section aria-labelledby="instruction-title" className="entry-instruction-card mb-5">
      <div className="mb-1.5 flex items-center justify-between">
        <h3 id="instruction-title" className="survey-section-title flex items-center !text-base !font-semibold">
          <Info size={18} className="text-brand-purple-600 mr-1.5" />
          Instruction:
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFlagModalOpen(true)}
          title="Flag this entry for review"
          className="h-auto px-2 py-1 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          disabled={isCurrentEvaluationSubmitted}
        >
          <Flag size={12} className="mr-1" /> Flag Entry
        </Button>
      </div>
      <div
        className="entry-instruction-text prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: instruction.replace(/\n/g, '<br/>') }}
      />
    </section>
  );
}
