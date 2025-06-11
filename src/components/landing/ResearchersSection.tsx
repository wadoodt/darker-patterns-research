// src/components/landing/ResearchersSection.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // For potential profile images
import { UserCircle2 } from 'lucide-react';
import useScrollAnimation from '@/hooks/useScrollAnimation';

const ResearchersSection = () => {
  const sectionRef = useScrollAnimation({ animationClass: 'anim-fade-in-up', threshold: 0.2, triggerOnce: true });

  // Dummy data for featured researchers
  const featuredResearchers = [
    { name: 'Israel A. Rosales L.', role: 'Principal Investigator', imageUrl: null /* "/images/israel-thumb.jpg" */ },
    { name: 'Dr. AI Ethicist (Example)', role: 'Ethics Advisor', imageUrl: null },
  ];

  return (
    <section id="researchers" className="bg-dark-bg-secondary py-16 sm:py-24">
      <div ref={sectionRef} className="scroll-animate-item mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="font-heading-display text-dark-text-primary text-glow-landing-alt mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Meet the Team
        </h2>
        <p className="text-dark-text-secondary mb-10 text-lg leading-8">
          Our project is driven by a passionate group dedicated to advancing ethical AI through rigorous research and
          community collaboration.
        </p>
        <div className="mb-10 flex flex-wrap justify-center gap-8">
          {featuredResearchers.map((researcher, index) => (
            <div key={index} className="flex flex-col items-center">
              {' '}
              {/* Individual item animation can be added if needed */}
              {researcher.imageUrl ? (
                <Image
                  src={researcher.imageUrl}
                  alt={researcher.name}
                  width={80}
                  height={80}
                  className="mb-2 rounded-full shadow-md"
                />
              ) : (
                <div className="bg-dark-bg-tertiary mb-2 flex h-20 w-20 items-center justify-center rounded-full shadow-md">
                  <UserCircle2 size={40} className="text-brand-purple-400" />
                </div>
              )}
              <h3 className="text-md text-dark-text-primary font-semibold">{researcher.name}</h3>
              <p className="text-brand-purple-300 text-xs">{researcher.role}</p>
            </div>
          ))}
        </div>
        <Link href="/info/researchers" className="btn-secondary-dark px-6 py-2.5 text-base">
          Learn More About Our Team
        </Link>
      </div>
    </section>
  );
};
export default ResearchersSection;
