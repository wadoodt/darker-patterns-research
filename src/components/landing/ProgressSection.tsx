// src/components/landing/ProgressSection.tsx
'use client';
import React from 'react';
import LandingProgressBar from './LandingProgressBar';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const ProgressSection = () => {
  const sectionRef = useScrollAnimation({ animationClass: 'anim-fade-in-up', threshold: 0.2, triggerOnce: true });

  const progressData = [
    { label: 'Overall Dataset Annotation', percentage: 75, colorClass: 'bg-brand-purple-500' },
    { label: 'Ethics & Safety Review Coverage', percentage: 90, colorClass: 'bg-accent-cyan' },
    { label: 'Min. 10 Reviews per Entry Target', percentage: 60, colorClass: 'bg-accent-pink' },
  ];
  return (
    <section id="progress" className="bg-dark-bg-primary py-16 sm:py-24">
      <div ref={sectionRef} className="scroll-animate-item mx-auto max-w-3xl px-6 lg:px-8">
        <h2 className="font-heading-display text-dark-text-primary text-glow-landing-alt mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Dataset Completion Progress
        </h2>
        <div className="space-y-6 sm:space-y-8">
          {progressData.map((item, index) => (
            <LandingProgressBar
              key={index}
              label={item.label}
              percentage={item.percentage}
              colorClass={item.colorClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProgressSection;
