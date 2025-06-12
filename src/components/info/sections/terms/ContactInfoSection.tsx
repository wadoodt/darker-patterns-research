import Link from 'next/link';

const ContactInfoSection = () => {
  return (
    <section id="contact-info">
      <h2 className="font-lora">8. Contact Information</h2>
      <p>
        If you have any questions about these Terms, your rights as a participant, or the Study, please{' '}
        <Link href="/contact-us">contact us</Link>.
      </p>
    </section>
  );
};

export default ContactInfoSection;
