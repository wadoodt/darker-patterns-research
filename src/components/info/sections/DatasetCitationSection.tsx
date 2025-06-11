import React from 'react';

interface DatasetCitationSectionProps {
  datasetPlaceholder: string;
}

const DatasetCitationSection: React.FC<DatasetCitationSectionProps> = ({ datasetPlaceholder }) => {
  return (
    <section id="citing-dataset">
      <h2 className="font-lora">Citing the Dataset (Forthcoming)</h2>
      <p>
        Once our DPO dataset is publicly released, we will provide a specific citation format, likely including a DOI
        (Digital Object Identifier). Please check back here for updates.
      </p>
      <blockquote className="border-brand-purple-300 bg-light-bg-tertiary border-l-4 py-2 pl-4 text-sm italic">
        <p className="mb-0">
          <strong>Placeholder:</strong> {datasetPlaceholder}. [Citation details and DOI link will be available upon
          release.]
        </p>
      </blockquote>
    </section>
  );
};

export default DatasetCitationSection;
