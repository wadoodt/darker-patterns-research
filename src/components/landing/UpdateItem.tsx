// src/components/landing/UpdateItem.tsx
'use client'; // Child of client component, or uses hooks
import useScrollAnimation from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils'; // Added missing import
import type { LucideProps } from 'lucide-react';
import { Zap } from 'lucide-react'; // Default icon
import React from 'react'; // Explicitly import React

interface UpdateItemProps {
  title: string;
  date: string;
  description: string;
  icon?: React.ReactElement<LucideProps>;
  animationDelay?: string; // e.g. '0.1s'
}

const UpdateItem: React.FC<UpdateItemProps> = ({ title, date, description, icon, animationDelay }) => {
  const itemRef = useScrollAnimation<HTMLDivElement>({
    animationClass: 'anim-fade-in-left',
    threshold: 0.1,
    triggerOnce: true,
  });

  const iconToRender = icon ? (
    React.cloneElement(icon, { size: icon.props.size || 14, className: cn(icon.props.className) })
  ) : (
    <Zap size={14} />
  );

  return (
    <div
      ref={itemRef}
      className="group scroll-animate-item relative flex items-start gap-x-4 sm:gap-x-5"
      style={animationDelay ? { animationDelay } : {}}
    >
      <div className="bg-dark-bg-tertiary/70 absolute top-3.5 left-3 h-[calc(100%-.875rem)] w-px group-last:hidden sm:left-3.5"></div>
      <div className="bg-brand-purple-600 ring-dark-bg-primary relative z-10 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white ring-4 sm:h-7 sm:w-7">
        {iconToRender}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="text-dark-text-primary text-base font-semibold sm:text-lg">{title}</h3>
        <p className="text-brand-purple-300 mt-0.5 text-xs font-medium sm:text-sm">{date}</p>
        <p className="text-dark-text-secondary mt-2 text-sm leading-6">{description}</p>
      </div>
    </div>
  );
};

export default UpdateItem;
