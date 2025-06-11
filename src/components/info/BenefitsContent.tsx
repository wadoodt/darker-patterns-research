import { Brain, CheckCircle, FileText, Lightbulb, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const BenefitItem = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <li className="flex items-start gap-3">
    <span className="text-brand-purple-500 mt-1 flex-shrink-0">{icon}</span>
    <div>
      <h3 className="font-lora text-light-text-primary text-lg font-semibold">{title}</h3>
      <p className="text-sm">{children}</p>
    </div>
  </li>
);

const BenefitsContent = () => {
  return (
    <div className="survey-page-container">
      <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-lora prose-headings:text-light-text-primary prose-p:text-light-text-secondary prose-strong:text-light-text-primary prose-ul:text-light-text-secondary prose-li:marker:text-brand-purple-500 prose-a:text-brand-purple-500 hover:prose-a:text-brand-purple-600 mx-auto max-w-3xl">
        <h1 className="survey-main-title !mb-6 sm:!mb-8">Benefits of Your Participation</h1>

        <p>
          Your involvement in the Dark Pattern Validation project is invaluable. By contributing your insights, you play
          a direct role in shaping a more ethical and transparent future for artificial intelligence. Here\u2019s how
          your participation makes a difference:
        </p>

        <ul className="mt-6 list-none space-y-6 p-0">
          <BenefitItem icon={<CheckCircle size={20} />} title="Contribute to Safer AI">
            Your evaluations help us identify and categorize dark patterns in Large Language Models (LLMs). This
            knowledge is crucial for developing AI systems that are less prone to manipulation and more aligned with
            user well-being.
          </BenefitItem>
          <BenefitItem icon={<Brain size={20} />} title="Advance Scientific Knowledge">
            You are contributing to a novel research area at the intersection of AI, ethics, and human-computer
            interaction. The dataset and findings from this study will be a valuable resource for researchers worldwide.
          </BenefitItem>
          <BenefitItem icon={<FileText size={20} />} title="Access to Research Findings">
            Participants who opt-in by providing their email address will receive a summary of our research findings and
            potentially a preprint of the final published paper, offering you a first look at the outcomes of this
            collective effort.
          </BenefitItem>
          <BenefitItem icon={<Lightbulb size={20} />} title="Gain Unique Insights">
            Engaging with the study materials can enhance your own understanding of how AI language models work, their
            current limitations, and the subtle ways they can influence user perception and behavior.
          </BenefitItem>
          <BenefitItem icon={<Users size={20} />} title="Support Open Research & Community">
            By participating, you support an open research initiative. The anonymized dataset we aim to release will
            benefit the entire AI community, fostering collaboration and accelerating progress in AI safety.
          </BenefitItem>
        </ul>

        <p className="mt-8">
          Every contribution, no matter how small, helps us achieve these goals. We are grateful for your time and
          effort.
        </p>
        <p className="mt-6">
          Ready to make an impact? <Link href="/survey/step-introduction">Start the survey now.</Link>
        </p>
      </article>
    </div>
  );
};
export default BenefitsContent;
