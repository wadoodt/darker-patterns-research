import CommitmentSection from './sections/CommitmentSection';
import ConsentSection from './sections/ConsentSection';
import ContactEthicsSection from './sections/ContactEthicsSection';
import DataCollectionSection from './sections/DataCollectionSection';
import ParticipationSection from './sections/ParticipationSection';
import PrivacySection from './sections/PrivacySection';
import RisksBenefitsSection from './sections/RisksBenefitsSection';

const EthicsPrivacyContent = () => {
  return (
    <div className="survey-page-container">
      <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-lora prose-headings:text-light-text-primary prose-p:text-light-text-secondary prose-strong:text-light-text-primary prose-ul:text-light-text-secondary prose-li:marker:text-brand-purple-500 prose-a:text-brand-purple-500 hover:prose-a:text-brand-purple-600 mx-auto max-w-3xl">
        <h1 className="survey-main-title !mb-6 sm:!mb-8">Ethics, Privacy & Participation in Research</h1>

        <CommitmentSection />
        <ParticipationSection />
        <DataCollectionSection />
        <PrivacySection />
        <RisksBenefitsSection />
        <ContactEthicsSection />
        <ConsentSection />

        <p className="mt-8 text-xs text-gray-500">Last updated: June 11, 2025</p>
      </article>
    </div>
  );
};

export default EthicsPrivacyContent;
