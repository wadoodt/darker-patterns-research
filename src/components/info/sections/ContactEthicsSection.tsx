import Link from 'next/link';

const ContactEthicsSection = () => {
  return (
    <section id="contact-ethics">
      <h2 className="font-lora">Contact for Questions or Concerns</h2>
      <p>
        If you have any questions about your rights as a research participant, or if you have concerns about the ethical
        conduct of this study, please contact the principal investigator, Israel A. Rosales L., at{' '}
        <a href="mailto:ai.darkpatterns.research@gmail.com">ai.darkpatterns.research@gmail.com</a>. For general
        inquiries, please use our <Link href="/info/contact-us">Contact Us page</Link>.
      </p>
    </section>
  );
};

export default ContactEthicsSection;
