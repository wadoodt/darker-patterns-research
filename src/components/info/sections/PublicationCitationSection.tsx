import React from 'react';

interface PublicationCitationSectionProps {
  primaryPaper: {
    title: string;
    authors: string;
    year: string;
    journal_conference: string;
    url: string;
  };
}

const PublicationCitationSection: React.FC<PublicationCitationSectionProps> = ({ primaryPaper }) => {
  return (
    <section id="citing-publications">
      <h2 className="font-lora">Citing Related Publications</h2>
      <p>
        Our primary research paper detailing the methodology, dataset construction, and findings is currently in
        preparation. Please cite it as follows (details will be updated upon publication):
      </p>
      <blockquote className="border-brand-purple-300 bg-light-bg-tertiary border-l-4 py-2 pl-4 text-sm italic">
        <p className="mb-1">
          <strong>{primaryPaper.title}</strong>
        </p>
        <p className="mb-1">
          {primaryPaper.authors}. ({primaryPaper.year}).
        </p>
        <p className="mb-1">
          <em>{primaryPaper.journal_conference}</em>.
        </p>
        {primaryPaper.url !== '#' && (
          <p className="mb-0">
            Available at:{' '}
            <a href={primaryPaper.url} target="_blank" rel="noopener noreferrer">
              {primaryPaper.url}
            </a>
          </p>
        )}
      </blockquote>
      <p className="mt-4">
        Please refer to the specific publication for the most accurate citation details once available.
      </p>
    </section>
  );
};

export default PublicationCitationSection;
