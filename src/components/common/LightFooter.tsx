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
      <div className="light-footer-content">
        <div className="mb-6 flex justify-center space-x-6">
          {renderLink('/ethics-privacy-participation', 'link-standard-light text-xs', 'Ethics & Privacy')}
          {renderLink('/terms-conditions', 'link-standard-light text-xs', 'Terms')}
          {renderLink('/contact-us', 'link-standard-light text-xs', 'Contact Us')}
        </div>
        <p className="light-footer-credit">Dark Pattern Validation Project &copy; {new Date().getFullYear()}.</p>
        <p className="light-footer-text">
          Built with <span className="text-red-500">&hearts;</span> by Anthony Laguan.
        </p>
      </div>
    </footer>
  );
};
export default LightFooter;
