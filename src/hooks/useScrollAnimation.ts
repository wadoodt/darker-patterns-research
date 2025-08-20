// src/hooks/useScrollAnimation.ts
'use client';
import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean; // Default true
  animationClass?: AnimationType; // e.g., 'anim-fade-in-up'
}

// Ensure AnimationType matches class names in animations.css
export type AnimationType =
  | 'anim-fade-in'
  | 'anim-fade-in-up'
  | 'anim-fade-in-left'
  | 'anim-fade-in-right'
  | 'anim-scale-up'; // Added scale-up

const useScrollAnimation = <T extends HTMLElement>(options?: IntersectionObserverOptions): RefObject<T> => {
  const elementRef = useRef<T>(null!);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const animationClass = options?.animationClass || 'anim-fade-in-up'; // Default animation if not specified
    const triggerOnce = options?.triggerOnce !== false; // Default to true

    // Initially add the base class and the specific animation class for initial state
    node.classList.add('scroll-animate-item', animationClass);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          if (triggerOnce) {
            observer.unobserve(node);
          }
        } else {
          if (!triggerOnce) {
            node.classList.remove('is-visible');
          }
        }
      },
      {
        threshold: options?.threshold || 0.15, // Slightly higher threshold
        rootMargin: options?.rootMargin || '0px',
      },
    );

    observer.observe(node);

    return () => {
      if (node) {
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [options?.animationClass, options?.threshold, options?.rootMargin, options?.triggerOnce]); // Re-run if options change

  return elementRef;
};

export default useScrollAnimation;
