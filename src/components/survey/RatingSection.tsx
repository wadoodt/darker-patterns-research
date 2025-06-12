import { Star } from 'lucide-react';
import { Fragment } from 'react';

export interface RatingSectionProps {
  selectedOptionKey: 'A' | 'B' | null;
  isCurrentEvaluationSubmitted: boolean;
  userRating: number;
  setUserRating: (rating: number) => void;
}

export default function RatingSection({
  selectedOptionKey,
  isCurrentEvaluationSubmitted,
  userRating,
  setUserRating,
}: RatingSectionProps) {
  if (!selectedOptionKey || isCurrentEvaluationSubmitted) return null;
  return (
    <section aria-labelledby="rating-title" className="survey-section-card mb-5 p-4">
      <h3 id="rating-title" className="survey-section-title mb-2.5 text-center !text-base !font-semibold">
        How confident are you in your choice? (1-5 Stars)
      </h3>
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Fragment key={starValue}>
            <input
              type="radio"
              id={`star${starValue}`}
              name="rating"
              value={starValue}
              checked={userRating === starValue}
              onChange={() => setUserRating(starValue)}
              className="star-rating-input"
              disabled={isCurrentEvaluationSubmitted}
            />
            <label htmlFor={`star${starValue}`} className="star-rating-label" title={`${starValue} stars`}>
              <Star fill={userRating >= starValue ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </label>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
