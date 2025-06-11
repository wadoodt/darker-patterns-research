import DatasetCitationSection from './sections/DatasetCitationSection';
import ProjectCitationSection from './sections/ProjectCitationSection';
import PublicationCitationSection from './sections/PublicationCitationSection';

const CitationContent = () => {
  const projectTitle = 'Dark Pattern Validation Project';
  const datasetPlaceholder = 'The DPV-Eval Dataset (Placeholder - To be released, DOI/Link will be provided here)';
  const primaryPaper = {
    title:
      'Dark Patterns in the Light: A Human-Validated Dataset and Benchmark for DPO Against Manipulative LLM Behaviors (Conceptual Title)',
    authors: 'Rosales L., I. A., et al. (Expected)',
    year: 'Forthcoming',
    journal_conference: 'ArXiv Pre-print / Conference Submission (To be determined)',
    url: '#', // Placeholder for actual paper link or DOI
  };

  return (
    <div className="survey-page-container">
      <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-lora prose-headings:text-light-text-primary prose-p:text-light-text-secondary prose-strong:text-light-text-primary prose-ul:text-light-text-secondary prose-li:marker:text-brand-purple-500 prose-a:text-brand-purple-500 hover:prose-a:text-brand-purple-600 mx-auto max-w-3xl">
        <h1 className="survey-main-title !mb-6 sm:!mb-8">How to Cite Our Work</h1>

        <p>
          If you use our research, platform, or the upcoming dataset in your work, we kindly request that you cite us
          appropriately. Proper citation helps acknowledge our efforts and allows others to find and build upon this
          research.
        </p>

        <ProjectCitationSection projectTitle={projectTitle} />
        <DatasetCitationSection datasetPlaceholder={datasetPlaceholder} />
        <PublicationCitationSection primaryPaper={primaryPaper} />

        <p className="mt-8 text-sm">
          Thank you for acknowledging our work. If you have specific questions about citation, please feel free to{' '}
          <a href="/info/contact-us">contact us</a>.
        </p>
      </article>
    </div>
  );
};

export default CitationContent;
