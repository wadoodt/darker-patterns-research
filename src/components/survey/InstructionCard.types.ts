export interface InstructionCardProps {
  instruction: string;
  isCurrentEvaluationSubmitted: boolean;
  setIsFlagModalOpen: (open: boolean) => void;
}
