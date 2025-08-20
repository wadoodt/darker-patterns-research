// components/landing/DarkFooter.tsx
import Link from 'next/link';

const DarkFooter = () => {
  return (
    <footer className="dark-footer">
      <div className="dark-footer-content">
        <div className="mb-8 flex justify-center space-x-6">
          <Link href="/ethics-privacy-participation" className="dark-footer-link">
            Ethics & Privacy
          </Link>
          <Link href="/terms-conditions" className="dark-footer-link">
            Terms
          </Link>
          <Link href="/contact-us" className="dark-footer-link">
            Contact Us
          </Link>
        </div>
        <p className="dark-footer-copyright">
          &copy; {new Date().getFullYear()} Dark Pattern Validation Project. All rights reserved.
        </p>
        <p className="text-dark-text-tertiary mt-2 text-xs leading-5">
          Built with <span className="text-red-500">&hearts;</span> by Anthony Laguan.
        </p>
      </div>
    </footer>
  );
};
export default DarkFooter;
