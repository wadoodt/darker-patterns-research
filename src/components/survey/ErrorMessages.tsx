import { AlertTriangle } from 'lucide-react';

export interface ErrorMessagesProps {
  localError: string | null;
  contextError: string | null;
  isCurrentEvaluationSubmitted: boolean;
}

export default function ErrorMessages({ localError, contextError, isCurrentEvaluationSubmitted }: ErrorMessagesProps) {
  return (
    <>
      {localError && !isCurrentEvaluationSubmitted && (
        <div className="my-4 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-600">
          <AlertTriangle size={16} /> {localError}
        </div>
      )}
      {contextError && (
        <div className="my-4 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-xs text-red-600">
          <AlertTriangle size={16} /> {contextError}
        </div>
      )}
    </>
  );
}
