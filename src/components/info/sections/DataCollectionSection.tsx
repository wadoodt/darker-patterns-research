const DataCollectionSection = () => {
  return (
    <section id="data-collection">
      <h2 className="font-lora">Data Collection & Usage</h2>
      <p>We collect the following types of data:</p>
      <ul>
        <li>
          <strong>Evaluation Data:</strong> Your choices, ratings, and comments on the AI-generated text.
        </li>
        <li>
          <strong>Demographic Data (Optional & Anonymized):</strong> If you provide it, information such as age group,
          gender, education level, field of expertise, and familiarity with AI. This helps us understand if different
          groups perceive AI responses differently.
        </li>
        <li>
          <strong>Session Data:</strong> A unique, randomly generated session ID to link your responses within a single
          session. We also collect timestamps and data related to your interaction with the survey (e.g., time spent on
          an entry).
        </li>
        <li>
          <strong>Email Address (Optional):</strong> If you choose to provide your email, it will be used solely to send
          you updates about the research, including a summary of findings or the final paper. It will be stored
          separately from your evaluation data.
        </li>
      </ul>
      <p>
        The anonymized data collected (excluding emails) will be used for research analysis, to create academic
        publications, and to develop a public dataset aimed at helping researchers and developers build safer and more
        ethical AI systems. This public dataset will not contain any directly identifiable information.
      </p>
    </section>
  );
};

export default DataCollectionSection;
