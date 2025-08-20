const PrivacySection = () => {
  return (
    <section id="privacy-confidentiality">
      <h2 className="font-lora">Data Privacy & Confidentiality</h2>
      <ul>
        <li>
          <strong>Protection of Email (if provided):</strong> If you provide an email address, it will be kept
          confidential and will not be shared with third parties. It will be stored separately from your evaluation
          responses and will not be part of any publicly released dataset.
        </li>
        <li>
          <strong>Anonymity of Responses:</strong> Your evaluation responses and any demographic data you provide will
          be anonymized. We will not attempt to link anonymous responses back to individuals.
        </li>
        <li>
          <strong>Data Security:</strong> We will use secure data storage practices to protect the information
          collected.
        </li>
        <li>
          <strong>Data Retention:</strong> Anonymized research data may be kept indefinitely for research purposes and
          as part of public datasets. Email addresses provided for updates will be kept until the final research updates
          are sent, or until you request removal.
        </li>
      </ul>
    </section>
  );
};

export default PrivacySection;
