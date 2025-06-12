// components/landing/DarkNavbar.tsx
'use client';
import { Menu, X } from 'lucide-react'; // Icons for mobile menu
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CTAButton from './CTAButton';

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

  const navLinks = [
    { href: '/#about-research', label: 'About' },
    { href: '/#progress', label: 'Progress' },
    { href: '/#benefits', label: 'Benefits' },
    { href: '/#researchers', label: 'Researchers' },
  ];

  return (
    <header className="dark-navbar">
      <nav className="dark-navbar-content">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <span className="dark-navbar-logo-accent font-headline text-2xl font-bold">DPV</span>
            <span className="dark-navbar-logo-text font-headline">Dark Pattern Validation</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="dark-navbar-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end">
          <CTAButton
            href="/survey/step-introduction"
            className="hidden px-4 py-2 text-sm sm:inline-flex" // Hide on very small screens if menu is better
          >
            Start Survey
          </CTAButton>
          {/* Mobile Menu Button */}
          <div className="ml-3 lg:hidden">
            <button
              type="button"
              className="text-dark-text-secondary hover:text-dark-text-primary -m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open main menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>

          {/* Panel */}
          <div className="bg-dark-bg-secondary sm:ring-dark-bg-tertiary/50 fixed inset-y-0 right-0 z-[101] w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="dark-navbar-logo-accent font-headline text-xl font-bold">DPV</span>
                <span className="dark-navbar-logo-text font-headline text-sm">Dark Pattern Validation</span>
              </Link>
              <button
                type="button"
                className="text-dark-text-secondary hover:text-dark-text-primary -m-2.5 rounded-md p-2.5"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="divide-dark-bg-tertiary/50 -my-6 divide-y">
                <div className="space-y-2 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-dark-text-primary hover:bg-dark-bg-tertiary -mx-3 block rounded-lg px-3 py-2 text-base leading-7 font-semibold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <CTAButton
                    href="/survey/step-introduction"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full justify-center px-4 py-2.5 text-base"
                  >
                    Start Survey
                  </CTAButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default DarkNavbar;
