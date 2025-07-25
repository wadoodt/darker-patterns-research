import React from "react";

type NameFieldsProps = {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const NameFields: React.FC<NameFieldsProps> = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  t,
}) => (
  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
    <div style={{ flex: 1 }}>
      <label htmlFor="firstName">{t("auth.signup.form.labels.firstName")}</label>
      <input
        id="firstName"
        type="text"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <label htmlFor="lastName">{t("auth.signup.form.labels.lastName")}</label>
      <input
        id="lastName"
        type="text"
        required
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />
    </div>
  </div>
);

export default NameFields;
