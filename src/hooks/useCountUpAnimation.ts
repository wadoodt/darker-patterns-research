// src/hooks/useCountUpAnimation.ts
import { useState, useEffect, useRef } from 'react';

interface UseCountUpAnimationProps {
  targetValue: number;
  duration?: number;
  animated: boolean;
  initialValue: string | number;
}

export const useCountUpAnimation = ({
  targetValue,
  duration = 1500,
  animated,
  initialValue,
}: UseCountUpAnimationProps) => {
  const [displayValue, setDisplayValue] = useState(String(initialValue));
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated) {
      setDisplayValue(String(initialValue));
      return;
    }

    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          const startTime = performance.now();

          const animateCount = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            let currentValToSet: string;

            if (progress === 1) {
              currentValToSet =
                typeof initialValue === 'string' && String(initialValue) !== String(targetValue)
                  ? String(initialValue)
                  : targetValue.toLocaleString();
            } else {
              const currentNum = progress * targetValue;
              currentValToSet = Math.round(currentNum).toLocaleString();
            }
            setDisplayValue(currentValToSet);

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            }
          };
          requestAnimationFrame(animateCount);
          observer.unobserve(node);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [animated, hasAnimated, targetValue, initialValue, duration]);

  return { displayValue, ref };
};
