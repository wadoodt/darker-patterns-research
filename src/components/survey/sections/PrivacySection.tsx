import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

const PrivacySection: React.FC = () => {
  return (
    <div className="survey-section-card mt-8 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck size={28} className="mt-0.5 flex-shrink-0 text-green-600" />
        <div>
          <h4 className="font-lora text-light-text-primary text-sm font-semibold">Your Privacy is Important</h4>
          <p className="text-light-text-secondary mt-0.5 text-xs">
            All data collected is for research purposes only and will be handled according to our{' '}
            <Link href="/ethics-privacy-participation" className="link-standard-light" target="_blank">
              Ethics & Privacy Policy
            </Link>
            . Email addresses, if provided, are stored separately and will not be linked to your specific evaluation
            responses in any public dataset.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;
