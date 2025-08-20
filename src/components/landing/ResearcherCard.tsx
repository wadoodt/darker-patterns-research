'use client';

import useScrollAnimation from '@/hooks/useScrollAnimation';
import { Github, Linkedin, UserCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ResearcherCardProps {
  name: string;
  role: string;
  imageUrl?: string;
  socials?: {
    github?: string;
    linkedin?: string;
  };
  animationDelay?: string;
}

const ResearcherCard: React.FC<ResearcherCardProps> = ({ name, role, imageUrl, socials, animationDelay }) => {
  const cardRef = useScrollAnimation<HTMLLIElement>({ animationClass: 'anim-fade-in-up' });

  return (
    <li ref={cardRef} className="scroll-animate-item flex flex-col items-center text-center" style={{ animationDelay }}>
      {imageUrl ? (
        <Image src={imageUrl} alt={name} width={96} height={96} className="mb-4 rounded-full shadow-lg" />
      ) : (
        <div className="bg-dark-bg-tertiary mb-4 flex h-24 w-24 items-center justify-center rounded-full shadow-lg">
          <UserCircle2 size={50} className="text-brand-purple-400" />
        </div>
      )}
      <h3 className="text-dark-text-primary text-lg font-bold">{name}</h3>
      <p className="text-brand-purple-300">{role}</p>
      {socials && (
        <div className="mt-4 flex gap-x-4">
          {socials.linkedin && (
            <Link href={socials.linkedin} className="text-dark-text-tertiary hover:text-dark-text-primary">
              <span className="sr-only">LinkedIn</span>
              <Linkedin size={20} />
            </Link>
          )}
          {socials.github && (
            <Link href={socials.github} className="text-dark-text-tertiary hover:text-dark-text-primary">
              <span className="sr-only">GitHub</span>
              <Github size={20} />
            </Link>
          )}
        </div>
      )}
    </li>
  );
};

export default ResearcherCard;
