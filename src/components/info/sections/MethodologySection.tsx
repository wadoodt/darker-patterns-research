const MethodologySection = () => {
  return (
    <section id="methodology">
      <h2 className="font-lora">Our Approach & Methodology</h2>
      <p>
        The core of our research relies on human evaluation conducted through this platform. Participants like you are
        presented with carefully crafted scenarios (instructions) and pairs of LLM-generated responses. Your task is to
        choose the response you prefer (or deem less harmful/manipulative) and provide a rating and optional feedback.
      </p>
      <p>
        This collected data, rich with human insights, forms the foundation of our specialized DPO dataset. We also
        employ simulated LLM evaluations and comparative analysis against human judgments to understand the alignment
        gap. Statistical metrics, such as Cohen&apos;s Kappa and correlation scores, are used to quantify agreement and
        validate our findings.
      </p>
    </section>
  );
};

export default MethodologySection;
