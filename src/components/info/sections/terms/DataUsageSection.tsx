const DataUsageSection = () => {
  return (
    <section id="data-usage">
      <h2 className="font-lora">4. Data Collection and Usage</h2>
      <p>The data collected during this Study includes:</p>
      <ul>
        <li>Your evaluations of AI-generated text (preferences, ratings, comments).</li>
        <li>
          Anonymized demographic information (age group, gender, education, expertise, AI familiarity) if you provide
          it.
        </li>
        <li>A unique, randomly generated session identifier to link your responses.</li>
        <li>
          Optionally, your email address if you choose to provide it for receiving research updates and the final paper.
        </li>
      </ul>
      <p>
        This data will be used for research purposes, including but not limited to: academic publications,
        presentations, the creation of a publicly available anonymized dataset to benefit the AI research community, and
        for developing tools and methods to improve AI safety and ethics. Your individual responses will be aggregated
        and anonymized in any public dissemination of results.
      </p>
    </section>
  );
};

export default DataUsageSection;
