'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  isDark?: boolean; // To switch between dark and light versions
  // Allow all other button or anchor props
  [key: string]: unknown;
}

const sparkleColors = ['#A78BFA', '#C4B5FD', '#818CF8', '#F472B6'];

const CTAButton: React.FC<CTAButtonProps> = ({ children, href, className = '', isDark = true, ...props }) => {
  const sparkleContainerRef = useRef<HTMLDivElement>(null);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Delay starting the animation to not interfere with initial page load
    const timer = setTimeout(() => {
      setAnimationsEnabled(true);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => {
    const container = sparkleContainerRef.current;
    if (!container) return;

    const createSparkle = () => {
      const sparkle = document.createElement('div');
      const size = Math.floor(Math.random() * 6) + 4; // Sparkle size between 4px and 10px
      const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

      sparkle.style.position = 'absolute';
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      sparkle.style.backgroundColor = color;
      sparkle.style.borderRadius = '50%';
      sparkle.style.boxShadow = `0 0 5px ${color}`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.animation = `sparkle-particle-anim 700ms ease-out forwards`;

      sparkle.onanimationend = () => {
        sparkle.remove();
      };

      container.appendChild(sparkle);
    };

    // Create a burst of sparkles
    for (let i = 0; i < 5; i++) {
      setTimeout(createSparkle, i * 50);
    }
  };

  const baseClasses = isDark ? 'btn-cta-dark' : 'btn-cta-light';
  const animationClass = animationsEnabled ? 'cta-anim-active' : '';

  const commonProps = {
    className: `btn-base ${baseClasses} ${animationClass} ${className}`,
    onMouseEnter: handleMouseEnter,
    ...props,
  };

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {children}
        <div ref={sparkleContainerRef} className="sparkle-container" aria-hidden="true"></div>
      </Link>
    );
  }

  return (
    <button type="button" {...commonProps}>
      {children}
      <div ref={sparkleContainerRef} className="sparkle-container" aria-hidden="true"></div>
    </button>
  );
};

export default CTAButton;
