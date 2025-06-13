import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { CommentsSectionProps } from './CommentsSection.types';

export default function CommentsSection({
  selectedOptionKey,
  userRating,
  isCurrentEvaluationSubmitted,
  userComment,
  setUserComment,
}: CommentsSectionProps) {
  if (!selectedOptionKey || userRating === 0 || isCurrentEvaluationSubmitted) return null;
  return (
    <section aria-labelledby="comments-title" className="survey-section-card mb-5 p-4">
      <h3 id="comments-title" className="survey-section-title mb-2 flex items-center !text-base !font-semibold">
        <MessageSquare size={18} className="text-brand-purple-600 mr-1.5" />
        Optional Comments
      </h3>
      <Textarea
        id="userComment"
        name="userComment"
        className="form-textarea-light w-full text-xs"
        placeholder="Add any comments about your choice, the instruction, or the responses (e.g., if both are bad, or if one is slightly better)..."
        value={userComment}
        onChange={(e) => setUserComment(e.target.value)}
        rows={3}
        disabled={isCurrentEvaluationSubmitted}
      />
    </section>
  );
}
