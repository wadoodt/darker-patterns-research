import { Info, Mail } from 'lucide-react'; // Added Info icon

const ContactUsContent = () => {
  const researchEmail = 'ai.darkpatterns.research@gmail.com'; // Replace with actual research email

  return (
    <div className="survey-page-container">
      <article className="prose prose-sm sm:prose-base lg:prose-lg prose-headings:font-lora prose-headings:text-light-text-primary prose-p:text-light-text-secondary prose-strong:text-light-text-primary prose-a:text-brand-purple-500 hover:prose-a:text-brand-purple-600 mx-auto max-w-3xl">
        <h1 className="survey-main-title !mb-6 sm:!mb-8">Contact Us</h1>

        <section id="introduction">
          <p>
            We welcome your questions, feedback, and inquiries related to the Dark Pattern Validation project. Whether
            you&apos;re a participant with questions about the study, a fellow researcher interested in collaboration,
            or a member of the press, please feel free to reach out.
          </p>
        </section>

        <section id="contact-methods" className="mt-8">
          <h2 className="font-lora">Primary Contact Method</h2>
          <div className="bg-light-bg-tertiary border-light-border-primary not-prose rounded-lg border p-6">
            {' '}
            {/* Use not-prose for custom layout inside prose */}
            <div className="text-light-text-primary flex items-center">
              <Mail size={24} className="text-brand-purple-500 mr-3 flex-shrink-0" />
              <h3 className="font-lora text-xl font-semibold">Email Us</h3>
            </div>
            <p className="text-light-text-secondary mt-2 text-sm">
              For all inquiries, including questions about research participation, data privacy, or potential
              collaborations, please email us at:
            </p>
            <p className="mt-3">
              <a
                href={`mailto:${researchEmail}`}
                className="text-brand-purple-600 hover:text-brand-purple-700 text-lg font-medium break-all"
              >
                {researchEmail}
              </a>
            </p>
            <p className="text-light-text-tertiary mt-3 text-xs">
              We aim to respond to all inquiries within 2-3 business days.
            </p>
          </div>
        </section>

        <section id="additional-info" className="mt-8">
          <h2 className="font-lora">Further Information</h2>
          <div className="bg-light-bg-tertiary border-light-border-primary not-prose rounded-lg border p-6">
            <div className="text-light-text-primary flex items-center">
              <Info size={24} className="text-brand-purple-500 mr-3 flex-shrink-0" />
              <h3 className="font-lora text-xl font-semibold">Looking for Specifics?</h3>
            </div>
            <p className="text-light-text-secondary mt-2 text-sm">
              For details regarding ethical considerations, data privacy, and participant rights, please refer to our{' '}
              <a href="/info/ethics-privacy-participation">Ethics, Privacy & Participation</a> page. Information about
              our research goals and methodology can be found on the{' '}
              <a href="/info/about-research">About Our Research</a> page.
            </p>
          </div>
        </section>

        {/* Placeholder for future contact form */}
        {/* 
        <section id="contact-form" className="mt-10">
          <h2 className="font-lora">Send Us a Message (Future Enhancement)</h2>
          <p>A contact form will be available here in a future update for your convenience.</p>
          <div className="mt-4 p-6 border border-dashed border-light-border-primary rounded-md bg-light-bg-tertiary text-center text-light-text-tertiary">
            Contact Form Placeholder
          </div>
        </section>
        */}
      </article>
    </div>
  );
};
export default ContactUsContent;
