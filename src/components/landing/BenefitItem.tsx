// src/components/landing/BenefitItem.tsx
'use client'; // Child of client component, or uses hooks
import useScrollAnimation from '@/hooks/useScrollAnimation'; // Import the hook
import type { LucideProps } from 'lucide-react';
import React from 'react';

interface BenefitItemProps {
  title: string;
  description: string;
  icon: React.ReactElement<LucideProps>;
  animationDelay?: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ title, description, icon, animationDelay }) => {
  const itemRef = useScrollAnimation<HTMLDivElement>({
    animationClass: 'anim-fade-in-up',
    threshold: 0.2,
    triggerOnce: true,
  });

  const iconToRender = React.cloneElement(icon, { size: icon.props.size || 28 });

  return (
    <div ref={itemRef} className="benefit-item scroll-animate-item" style={animationDelay ? { animationDelay } : {}}>
      <div className="benefit-icon">{iconToRender}</div>
      <div>
        <h3 className="benefit-title">{title}</h3>
        <p className="benefit-description">{description}</p>
      </div>
    </div>
  );
};

export default BenefitItem;
