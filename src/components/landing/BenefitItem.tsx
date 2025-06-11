// src/components/landing/BenefitItem.tsx
'use client'; // Child of client component, or uses hooks
import type { LucideProps } from 'lucide-react';
import React from 'react';
import useScrollAnimation from '@/hooks/useScrollAnimation'; // Import the hook

interface BenefitItemProps {
  title: string;
  description: string;
  icon: React.ReactElement<LucideProps>;
  animationDelay?: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ title, description, icon, animationDelay }) => {
  const itemRef = useScrollAnimation({ animationClass: 'anim-fade-in-up', threshold: 0.2, triggerOnce: true });

  const iconToRender = React.cloneElement(icon, { size: icon.props.size || 28 });

  return (
    <div
      ref={itemRef}
      className="bg-dark-bg-tertiary/70 hover-animate-card-dark scroll-animate-item flex items-start gap-4 rounded-xl p-6 shadow-lg sm:gap-5"
      style={animationDelay ? { animationDelay } : {}}
    >
      <div className="text-brand-purple-400 mt-1 flex-shrink-0">{iconToRender}</div>
      <div>
        <h3 className="text-dark-text-primary text-lg font-semibold sm:text-xl">{title}</h3>
        <p className="text-dark-text-secondary mt-1 text-sm leading-relaxed sm:text-base">{description}</p>
      </div>
    </div>
  );
};

export default BenefitItem;
