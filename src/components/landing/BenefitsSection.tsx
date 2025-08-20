// src/components/landing/BenefitsSection.tsx
'use client';
import { Brain, FileText, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import BenefitItem from './BenefitItem';

const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Access to Findings',
      description: 'Opt-in to receive a summary of research findings or the final published paper.',
      icon: <FileText size={28} />,
    },
    {
      title: 'Contribute to AI Ethics',
      description: 'Directly impact the development of safer, more aligned Large Language Models.',
      icon: <Brain size={28} />,
    },
    {
      title: 'Join a Research Community',
      description: 'Become part of a global effort to improve AI through human-centered evaluation.',
      icon: <Users size={28} />,
    },
    {
      title: 'Drive Innovation',
      description: 'Your insights help refine AI tools and make them more beneficial for everyone.',
      icon: <Zap size={28} />,
    },
  ];
  return (
    <section id="benefits" className="py-16 sm:py-24">
      <div className="section-container">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="section-title">Benefits of Participation</h2>
          <p className="hero-paragraph mx-auto mt-4 max-w-2xl">
            Your involvement directly contributes to a safer, more transparent digital ecosystem for everyone.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <BenefitItem key={index} {...benefit} animationDelay={`${index * 100}ms`} />
            ))}
          </dl>
          <div className="mt-16 text-center">
            <Link
              href="/benefits"
              className="btn-link-dark px-6 py-2.5 text-base"
              aria-label="Learn more about the benefits of participation"
            >
              Learn More About Benefits
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BenefitsSection;
