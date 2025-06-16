// src/components/landing/LandingPageContent.tsx
import LazyLoadOnScroll from '../common/LazyLoadOnScroll';
import BenefitsSection from './BenefitsSection';
import HeroSection from './HeroSection';
import ProgressSection from './ProgressSection';
import ResearchersSection from './ResearchersSection';
import StatsSection from './StatsSection';
import UpdatesSection from './UpdatesSection';

const LandingPageContent = () => {
  return (
    <>
      <h1 className="sr-only">Dark Pattern Validation Project - Landing Page</h1>
      <HeroSection />
      <ResearchersSection />
      <LazyLoadOnScroll className="min-h-[30rem]">
        <BenefitsSection />
      </LazyLoadOnScroll>
      <LazyLoadOnScroll className="min-h-[30rem]">
        <StatsSection />
      </LazyLoadOnScroll>
      <LazyLoadOnScroll className="min-h-[25rem]">
        <ProgressSection />
      </LazyLoadOnScroll>
      <LazyLoadOnScroll className="min-h-[25rem]">
        <UpdatesSection />
      </LazyLoadOnScroll>
    </>
  );
};
export default LandingPageContent;
