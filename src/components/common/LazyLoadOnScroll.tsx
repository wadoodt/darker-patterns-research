'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazyLoadOnScrollProps {
  children: React.ReactNode;
  className?: string; // To pass classes for styling, e.g., min-height
}

const LazyLoadOnScroll: React.FC<LazyLoadOnScrollProps> = ({ children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before it enters the viewport
      },
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? children : null}
    </div>
  );
};

export default LazyLoadOnScroll;
