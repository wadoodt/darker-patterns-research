import ImpactSection from './sections/ImpactSection';
import IntroductionSection from './sections/IntroductionSection';
import MethodologySection from './sections/MethodologySection';
import ObjectivesSection from './sections/ObjectivesSection';

const AboutResearchContent = () => {
  return (
    <div className="survey-page-container">
      {' '}
      {/* Using survey-page-container for consistent max-width and padding */}
      <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-lora prose-headings:text-light-text-primary prose-p:text-light-text-secondary prose-strong:text-light-text-primary prose-ul:text-light-text-secondary prose-li:marker:text-brand-purple-500 prose-a:text-brand-purple-500 hover:prose-a:text-brand-purple-600 mx-auto max-w-3xl">
        <h1 className="survey-main-title !mb-6 sm:!mb-8">About Our Research: Uncovering Dark Patterns in LLMs</h1>
        <IntroductionSection />
        <ObjectivesSection />
        <MethodologySection />
        <ImpactSection />
      </article>
    </div>
  );
};

export default AboutResearchContent;
