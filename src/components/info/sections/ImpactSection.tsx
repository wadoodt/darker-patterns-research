import Link from 'next/link';

const ImpactSection = () => {
  return (
    <section id="impact">
      <h2 className="font-lora">Expected Impact & Contributions</h2>
      <p>We believe this research will make significant contributions by:</p>
      <ul>
        <li>
          Providing the AI community with the first large-scale, open dataset specifically focused on LLM dark patterns.
        </li>
        <li>Offering a standardized benchmark for evaluating and comparing models on these nuanced behaviors.</li>
        <li>
          Demonstrating practical methods for mitigating such harms, leading to the development of more ethical LLMs.
        </li>
        <li>
          Increasing awareness among developers, policymakers, and the public about the subtle risks associated with
          advanced AI interactions.
        </li>
        <li>
          Ultimately, fostering a future where AI systems are not only capable but also genuinely aligned with human
          values and well-being.
        </li>
      </ul>
      <p className="mt-6">
        Interested in participating? <Link href="/step-introduction">Contribute to the study.</Link>
      </p>
    </section>
  );
};

export default ImpactSection;
