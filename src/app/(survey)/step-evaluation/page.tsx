// app/(survey)/step-evaluation/page.tsx
import EntryReviewStepContent from '@/components/survey/EntryReviewStepContent';

export const metadata = { title: 'Evaluate Pattern' };

export default function EvaluationPage() {
  // In reality, this would fetch/receive a specific entryId
  // For now, it might be /app/(survey)/step-evaluation/[entryId]/page.tsx
  return <EntryReviewStepContent entryId="dummyEntry123" />;
}
