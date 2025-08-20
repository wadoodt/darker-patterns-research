// components/common/LightFooter.tsx
import StylizedLink from './StylizedLink';

const LightFooter = () => {
  return (
    <footer className="light-footer">
      <div className="light-footer-content">
        <div className="mb-6 flex justify-center space-x-6">
          <StylizedLink href="/ethics-privacy-participation" className="link-standard-light text-xs">
            Ethics & Privacy
          </StylizedLink>
          <StylizedLink href="/terms-conditions" className="link-standard-light text-xs">
            Terms
          </StylizedLink>
          <StylizedLink href="/contact-us" className="link-standard-light text-xs">
            Contact Us
          </StylizedLink>
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
