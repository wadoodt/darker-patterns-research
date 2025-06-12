'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import CTAButton from './CTAButton';

// Lazy load the FloatingIcons component, and disable SSR since it's client-side only.
const FloatingIcons = dynamic(() => import('./FloatingIcons'), {
  ssr: false,
});

const HeroSection = () => {
  return (
    <section id="about-research" className="landing-hero-section pt-20">
      <FloatingIcons />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="landing-hero-title">Contribute to Groundbreaking Research</h2>
        <p className="hero-paragraph mx-auto mt-6 max-w-2xl">
          Join our study on <strong className="hero-paragraph-highlight">Dark Patterns in LLMs</strong>. Your
          participation is crucial for building a human-validated DPO dataset and fostering more ethical AI.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-x-6 gap-y-4 sm:flex-row">
          <CTAButton href="/step-introduction" className="px-8 py-3 text-lg font-bold sm:text-xl">
            Start Survey
          </CTAButton>
          <Link href="/about-research" className="btn-link-dark text-sm leading-6 font-semibold">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
