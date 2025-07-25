import React from "react";

type EmailFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
  disabled?: boolean;
  required?: boolean;
};

const EmailField: React.FC<EmailFieldProps> = ({
  value,
  onChange,
  t,
  disabled,
  required = true,
}) => (
  <div className="mb-4">
    <label htmlFor="email" className="block mb-1 font-medium">
      {t("auth.signup.form.labels.email")}
    </label>
    <input
      id="email"
      type="email"
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

export default EmailField;
