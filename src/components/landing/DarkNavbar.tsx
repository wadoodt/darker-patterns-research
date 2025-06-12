// components/landing/DarkNavbar.tsx
'use client';
import { navLinks } from '@/lib/navigation';
import { useEffect, useState } from 'react';
import DarkNavbarView from './DarkNavbarView';

const DarkNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter for the links you want to show in the dark navbar
  const mainNavLinks = navLinks.filter((link) => link.group === 'landing');

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <DarkNavbarView
      mobileMenuOpen={mobileMenuOpen}
      mainNavLinks={mainNavLinks}
      onMobileMenuToggle={handleMobileMenuToggle}
    />
  );
};
export default DarkNavbar;
