const ObjectivesSection = () => {
  return (
    <section id="objectives">
      <h2 className="font-lora">Key Research Objectives</h2>
      <ul>
        <li>
          To develop a clear taxonomy of dark patterns applicable to LLM interactions across various harm categories
          (psychological, economic, autonomy, etc.).
        </li>
        <li>
          To collect a diverse set of human preference data on LLM responses, specifically identifying instances of dark
          patterns versus helpful and harmless alternatives.
        </li>
        <li>
          To construct a high-quality Direct Preference Optimization (DPO) dataset tailored for fine-tuning models to
          reduce manipulative behaviors.
        </li>
        <li>
          To benchmark existing open-source and commercial LLMs against our dataset to assess their current
          susceptibility to generating dark patterns.
        </li>
        <li>
          To explore and evaluate the effectiveness of various mitigation techniques, including DPO fine-tuning and
          post-hoc detection modules.
        </li>
        <li>
          To publicly release our dataset, benchmark suite, and findings to foster broader research and collaboration in
          this critical area of AI safety.
        </li>
      </ul>
    </section>
  );
};

export default ObjectivesSection;
