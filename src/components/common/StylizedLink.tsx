// components/common/StylizedLink.tsx
'use client';
import Link, { type LinkProps } from 'next/link';
import type React from 'react';

interface StylizedLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

const StylizedLink: React.FC<StylizedLinkProps> = ({ href, children, className, ...props }) => {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

export default StylizedLink;
