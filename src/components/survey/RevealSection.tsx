import { cn } from '@/lib/utils';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { RevealSectionProps } from './RevealSection.types';

export default function RevealSection({
  isRevealed,
  isCurrentEvaluationSubmitted,
  currentDisplayEntry,
  selectedOptionKey,
  userChoseCorrectlyIfRevealed,
  dpoEntriesToReview,
  currentDpoEntryIndex,
}: RevealSectionProps) {
  if (!isRevealed || !currentDisplayEntry) return null;
  return (
    <section aria-labelledby="reveal-title" className="reveal-section survey-section-card visible mt-2 p-4 sm:p-5">
      <h3 id="reveal-title" className="survey-section-title mb-3 text-center !text-base !font-semibold">
        Results &amp; Rationale for Entry:{' '}
        <span className="font-mono text-xs">{currentDisplayEntry.id.substring(0, 12)}...</span>
      </h3>
      <div className="space-y-3 text-sm text-gray-700">
        <p
          className={cn(
            'flex items-center gap-2 rounded-md p-2 text-xs sm:text-sm',
            userChoseCorrectlyIfRevealed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
          )}
        >
          {userChoseCorrectlyIfRevealed ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
          You chose: <strong className="font-semibold">{selectedOptionKey === 'A' ? 'Option A' : 'Option B'}</strong>.
          This was the{' '}
          <strong className="font-semibold">
            {userChoseCorrectlyIfRevealed ? "researchers' preferred choice." : 'less preferred choice by researchers.'}
          </strong>
        </p>
        {currentDisplayEntry.discussion && (
          <div>
            <h4 className="font-lora mt-3 mb-1 text-sm font-semibold text-gray-800">Researcher&apos;s Rationale:</h4>
            <div
              className="reveal-discussion-text prose prose-sm max-w-none text-xs text-gray-600"
              dangerouslySetInnerHTML={{ __html: currentDisplayEntry.discussion.replace(/\n/g, '<br/>') }}
            />
          </div>
        )}
        {/* <div className="mt-3 space-y-2 text-xs">
          <details className="reveal-details-box rounded border border-green-300 bg-green-50/50 p-2">
            <summary className="cursor-pointer font-semibold text-green-700 hover:underline">
              Show Researchers&apos; Preferred Response
            </summary>
            <div
              className="prose prose-xs mt-1.5 max-w-none border-t border-green-200 pt-1.5 text-gray-600"
              dangerouslySetInnerHTML={{ __html: currentDisplayEntry.acceptedResponse.replace(/\n/g, '<br/>') }}
            />
          </details>
          <details className="reveal-details-box rounded border border-red-300 bg-red-50/50 p-2">
            <summary className="cursor-pointer font-semibold text-red-700 hover:underline">
              Show Researchers&apos; Less Preferred Response
            </summary>
            <div
              className="prose prose-xs mt-1.5 max-w-none border-t border-red-200 pt-1.5 text-gray-600"
              dangerouslySetInnerHTML={{ __html: currentDisplayEntry.rejectedResponse.replace(/\n/g, '<br/>') }}
            />
          </details>
        </div> */}
        {isCurrentEvaluationSubmitted && (
          <p className="mt-4 text-center text-xs text-gray-500">
            {currentDpoEntryIndex < dpoEntriesToReview.length - 1
              ? "Click 'Next Entry' below to continue."
              : "All entries evaluated! Click 'Finish Evaluation' below."}
          </p>
        )}
      </div>
    </section>
  );
}
