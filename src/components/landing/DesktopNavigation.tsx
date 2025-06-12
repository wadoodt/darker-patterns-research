import { type NavLink } from '@/lib/navigation';
import Link from 'next/link';
import CTAButton from './CTAButton';

interface DesktopNavigationProps {
  mainNavLinks: NavLink[];
}

const DesktopNavigation = ({ mainNavLinks }: DesktopNavigationProps) => {
  return (
    <>
      <div className="hidden lg:flex lg:gap-x-8">
        {mainNavLinks.map((link) => (
          <Link key={link.label} href={link.href} className="dark-navbar-link">
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-1 items-center justify-end">
        <CTAButton href="/step-introduction" className="hidden px-4 py-2 text-sm sm:inline-flex">
          Start Survey
        </CTAButton>
      </div>
    </>
  );
};

export default DesktopNavigation;
