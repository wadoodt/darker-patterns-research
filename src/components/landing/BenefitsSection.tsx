// src/components/landing/BenefitsSection.tsx
'use client';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Brain, FileText, Users, Zap } from 'lucide-react';
import BenefitItem from './BenefitItem';

const BenefitsSection = () => {
  const sectionRef = useScrollAnimation({ animationClass: 'anim-fade-in-up', threshold: 0.2, triggerOnce: true });

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
    <section id="benefits" className="bg-dark-bg-primary py-16 sm:py-24">
      <div ref={sectionRef} className="scroll-animate-item mx-auto max-w-4xl px-6 lg:px-8">
        <h2 className="font-heading-display text-dark-text-primary text-glow-landing-alt mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Why Your Participation Matters
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <BenefitItem key={index} {...benefit} animationDelay={`${index * 100}ms`} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default BenefitsSection;
