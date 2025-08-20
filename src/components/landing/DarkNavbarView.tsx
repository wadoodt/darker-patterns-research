// components/landing/DarkNavbarView.tsx
import { type NavLink } from '@/lib/navigation';
import Link from 'next/link';
import DesktopNavigation from './DesktopNavigation';
import MobileMenuButton from './MobileMenuButton';
import MobileNavigation from './MobileNavigation';

interface DarkNavbarViewProps {
  mobileMenuOpen: boolean;
  mainNavLinks: NavLink[];
  onMobileMenuToggle: () => void;
}

const DarkNavbarView = ({ mobileMenuOpen, mainNavLinks, onMobileMenuToggle }: DarkNavbarViewProps) => {
  return (
    <header className="dark-navbar sticky top-0 z-50">
      <nav className="dark-navbar-content">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <span className="dark-navbar-logo-accent font-headline text-2xl font-bold">DPV</span>
            <span className="dark-navbar-logo-text font-headline">Dark Pattern Validation</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <DesktopNavigation mainNavLinks={mainNavLinks} />

        {/* Mobile Menu Toggle Button */}
        <MobileMenuButton onMobileMenuToggle={onMobileMenuToggle} />
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && <MobileNavigation mainNavLinks={mainNavLinks} onMobileMenuToggle={onMobileMenuToggle} />}
    </header>
  );
};

export default DarkNavbarView;
