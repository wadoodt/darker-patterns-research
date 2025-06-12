'use client';
import dynamic from 'next/dynamic';
import CTAButton from './CTAButton';

// Lazy load the FloatingIcons component, and disable SSR since it's client-side only.
const FloatingIcons = dynamic(() => import('./FloatingIcons'), {
  ssr: false,
});

const HeroSection = () => {
  return (
    <section id="about-research" className="landing-hero-section">
      <FloatingIcons /> {/* To be implemented with actual animations */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="landing-hero-title text-glow-landing-alt">Contribute to Groundbreaking Research</h2>
        <p className="text-dark-text-secondary mx-auto mt-6 max-w-2xl text-lg leading-8">
          Join our study on <strong className="text-brand-purple-300">Dark Patterns in LLMs</strong>. Your participation
          is crucial for building a human-validated DPO dataset and fostering more ethical AI.
        </p>
        <div className="mt-10">
          <CTAButton href="/survey/step-introduction" className="px-8 py-3 text-lg font-bold sm:text-xl">
            Start Survey
          </CTAButton>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
