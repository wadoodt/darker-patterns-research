// components/common/LightFooter.tsx
import React from 'react';
import ProtectedLink from './ProtectedLink';
import StylizedLink from './StylizedLink';

const LightFooter = () => {
  // Helper function to determine if a path requires protection
  const needsProtection = (path: string): boolean => {
    return path.startsWith('/survey');
  };

  const renderLink = (href: string, className: string, children: React.ReactNode) => {
    if (needsProtection(href)) {
      return (
        <ProtectedLink href={href} className={className}>
          {children}
        </ProtectedLink>
      );
    }
    return (
      <StylizedLink href={href} className={className}>
        {children}
      </StylizedLink>
    );
  };

  return (
    <footer className="light-footer">
      {' '}
      {/* Class from /styles/survey.css or footers.css */}
      <div className="light-footer-content">
        <div className="mb-6 flex justify-center space-x-6">
          {renderLink('/info/ethics-privacy-participation', 'link-standard-light text-xs', 'Ethics &amp; Privacy')}
          {renderLink('/info/terms-conditions', 'link-standard-light text-xs', 'Terms')}
          {renderLink('/info/contact-us', 'link-standard-light text-xs', 'Contact Us')}
        </div>
        <p className="light-footer-credit">Dark Pattern Validation Project &copy; {new Date().getFullYear()}.</p>
        <p className="light-footer-text">
          Built with <span className="text-red-500">&hearts;</span> by the Firebase team.
        </p>
      </div>
    </footer>
  );
};
export default LightFooter;
