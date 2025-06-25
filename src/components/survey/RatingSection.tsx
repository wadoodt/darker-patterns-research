import { Star } from 'lucide-react';
import { Fragment } from 'react';
import { RatingSectionProps } from './RatingSection.types';

export default function RatingSection({ agreementRating, setAgreementRating, isUIBlocked }: RatingSectionProps) {
  return (
    <section aria-labelledby="rating-title" className="survey-section-card mb-5 p-4">
      <h3 id="rating-title" className="survey-section-title mb-2.5 text-center !text-base !font-semibold">
        How strongly do you agree with the researcher’s option & categories? (1 = disagree, 5 = agree)
      </h3>
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Fragment key={starValue}>
            <input
              type="radio"
              id={`star${starValue}`}
              name="rating"
              value={starValue}
              checked={agreementRating === starValue}
              onChange={() => setAgreementRating(starValue)}
              className="star-rating-input"
              disabled={isUIBlocked}
            />
            <label htmlFor={`star${starValue}`} className="star-rating-label" title={`${starValue} stars`}>
              <Star fill={agreementRating >= starValue ? 'currentColor' : 'none'} strokeWidth={1.5} />
            </label>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
