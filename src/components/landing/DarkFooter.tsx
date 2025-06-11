// components/landing/DarkFooter.tsx
import Link from 'next/link';
import React from 'react';

const DarkFooter = () => {
  return (
    <footer className="dark-footer">
      {' '}
      {/* Class from /styles/landing.css or footers.css */}
      <div className="dark-footer-content">
        <div className="mb-8 flex justify-center space-x-6">
          <Link href="/info/ethics-privacy-participation" className="dark-footer-link">
            Ethics & Privacy
          </Link>
          <Link href="/info/terms-conditions" className="dark-footer-link">
            Terms
          </Link>
          <Link href="/info/contact-us" className="dark-footer-link">
            Contact Us
          </Link>
        </div>
        <p className="dark-footer-copyright">
          &copy; {new Date().getFullYear()} Dark Pattern Validation Project. All rights reserved.
        </p>
        <p className="text-dark-text-tertiary mt-2 text-xs leading-5">
          Built with <span className="text-red-500">&hearts;</span> by the Firebase team.
        </p>
      </div>
    </footer>
  );
};
export default DarkFooter;
