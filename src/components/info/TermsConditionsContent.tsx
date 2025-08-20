import AcknowledgmentSection from './sections/terms/AcknowledgmentSection';
import ConfidentialitySection from './sections/terms/ConfidentialitySection';
import ContactInfoSection from './sections/terms/ContactInfoSection';
import DataUsageSection from './sections/terms/DataUsageSection';
import EligibilitySection from './sections/terms/EligibilitySection';
import IntroductionSection from './sections/terms/IntroductionSection';
import OwnershipSection from './sections/terms/OwnershipSection';
import ParticipationSection from './sections/terms/ParticipationSection';
import RisksBenefitsSection from './sections/terms/RisksBenefitsSection';

const TermsConditionsContent = () => {
  return (
    <div className="survey-page-container">
      <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-lora prose-headings:text-light-text-primary prose-p:text-light-text-secondary prose-strong:text-light-text-primary prose-ul:text-light-text-secondary prose-li:marker:text-brand-purple-500 prose-a:text-brand-purple-500 hover:prose-a:text-brand-purple-600 mx-auto max-w-3xl">
        <h1 className="survey-main-title !mb-6 sm:!mb-8">Terms and Conditions for Research Participation</h1>

        <IntroductionSection />
        <EligibilitySection />
        <ParticipationSection />
        <DataUsageSection />
        <ConfidentialitySection />
        <RisksBenefitsSection />
        <OwnershipSection />
        <ContactInfoSection />
        <AcknowledgmentSection />

        <p className="mt-8 text-xs text-gray-500">Last updated: June 11, 2025</p>
      </article>
    </div>
  );
};

export default TermsConditionsContent;
