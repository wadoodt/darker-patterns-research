// src/components/landing/HeroSection.tsx
import type React from 'react';
// import CTAButton from '../common/CTAButton'; // Assuming CTAButton is styled for dark theme via props or context
import FloatingIcons from './FloatingIcons'; // Will implement animations later
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section id="about-research" className="landing-hero-section">
      {' '}
      {/* From styles/landing.css */}
      <FloatingIcons /> {/* To be implemented with actual animations */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="landing-hero-title text-glow-landing-alt">
          {' '}
          {/* from styles/landing.css */}
          Contribute to Groundbreaking Research
        </h2>
        <p className="text-dark-text-secondary mx-auto mt-6 max-w-2xl text-lg leading-8">
          Join our study on <strong className="text-brand-purple-300">Dark Patterns in LLMs</strong>. Your participation
          is crucial for building a human-validated DPO dataset and fostering more ethical AI.
        </p>
        <div className="mt-10">
          <Link
            href="/survey/step-introduction"
            className="btn-cta-dark px-8 py-3 text-lg font-bold sm:text-xl" // Directly apply CTA style
          >
            Start Survey
            <div className="sparkle-container"></div> {/* For sparkle effect */}
          </Link>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
