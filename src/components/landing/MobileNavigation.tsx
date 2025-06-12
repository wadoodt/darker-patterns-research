import { type NavLink } from '@/lib/navigation';
import { X } from 'lucide-react';
import Link from 'next/link';
import CTAButton from './CTAButton';

interface MobileNavigationProps {
  mainNavLinks: NavLink[];
  onMobileMenuToggle: () => void;
}

const MobileNavigation = ({ mainNavLinks, onMobileMenuToggle }: MobileNavigationProps) => {
  return (
    <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileMenuToggle}></div>

      {/* Panel */}
      <div className="bg-dark-bg-secondary sm:ring-dark-bg-tertiary/50 fixed inset-y-0 right-0 z-[101] w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1">
        <div className="flex items-center justify-between">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5" onClick={onMobileMenuToggle}>
            <span className="dark-navbar-logo-accent font-headline text-xl font-bold">DPV</span>
            <span className="dark-navbar-logo-text font-headline text-sm">Dark Pattern Validation</span>
          </Link>
          <button
            type="button"
            className="text-dark-text-secondary hover:text-dark-text-primary -m-2.5 rounded-md p-2.5"
            onClick={onMobileMenuToggle}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="divide-dark-bg-tertiary/50 -my-6 divide-y">
            <div className="space-y-2 py-6">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onMobileMenuToggle}
                  className="text-dark-text-primary hover:bg-dark-bg-tertiary -mx-3 block rounded-lg px-3 py-2 text-base leading-7 font-semibold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="py-6">
              <CTAButton
                href="/step-introduction"
                onClick={onMobileMenuToggle}
                className="w-full justify-center px-4 py-2.5 text-base"
              >
                Start Survey
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
