import React from 'react';

interface ProjectCitationSectionProps {
  projectTitle: string;
}

const ProjectCitationSection: React.FC<ProjectCitationSectionProps> = ({ projectTitle }) => {
  return (
    <section id="citing-project">
      <h2 className="font-lora">Citing the Project/Platform</h2>
      <p>
        To cite the {projectTitle} platform or the overall research initiative, please use the following general format
        (details may be updated as the project evolves):
      </p>
      <blockquote className="border-brand-purple-300 bg-light-bg-tertiary border-l-4 py-2 pl-4 text-sm italic">
        <p className="mb-0">
          Rosales L., I. A., and Collaborators. ({new Date().getFullYear()}). <em>{projectTitle}</em>. Retrieved from
          [Your Project Website URL, e.g., https://darkpatternvalidator.web.app]
        </p>
      </blockquote>
    </section>
  );
};

export default ProjectCitationSection;
