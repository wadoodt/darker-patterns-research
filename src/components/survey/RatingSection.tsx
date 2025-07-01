import { Star } from 'lucide-react';
import { Fragment, useState } from 'react';
import { RatingSectionProps } from './RatingSection.types';

export default function RatingSection({ agreementRating, setAgreementRating, isUIBlocked }: RatingSectionProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleMouseEnter = (starValue: number) => {
    if (!isUIBlocked) {
      setHoveredRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const getStarFill = (starValue: number) => {
    // If hovering, show hover state up to hovered star
    if (hoveredRating !== null) {
      return starValue <= hoveredRating ? 'currentColor' : 'none';
    }
    // Otherwise show actual rating
    return agreementRating >= starValue ? 'currentColor' : 'none';
  };

  const getStarOpacity = (starValue: number) => {
    // When hovering, make non-hovered stars more transparent
    if (hoveredRating !== null && starValue > hoveredRating) {
      return 0.3;
    }
    return 1;
  };

  return (
    <section aria-labelledby="rating-title" className="survey-section-card mb-5 p-4" data-tour="rating">
      <h3 id="rating-title" className="survey-section-title mb-2.5 text-center !text-base !font-semibold">
        How strongly do you agree with the researcher&apos;s option &amp; categories? (1 = disagree, 5 = agree)
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
            <label
              htmlFor={`star${starValue}`}
              className="star-rating-label"
              title={`${starValue} stars`}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              style={{
                opacity: getStarOpacity(starValue),
                cursor: isUIBlocked ? 'not-allowed' : 'pointer',
              }}
            >
              <Star
                fill={getStarFill(starValue)}
                strokeWidth={1.5}
                style={{
                  transition: 'fill 0.2s ease',
                  color:
                    hoveredRating !== null && starValue <= hoveredRating
                      ? '#fbbf24'
                      : agreementRating >= starValue
                        ? '#f59e0b'
                        : '#d1d5db',
                }}
              />
            </label>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
