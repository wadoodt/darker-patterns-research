import React from "react";

type PasswordFieldProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
  disabled?: boolean;
  required?: boolean;
};

const PasswordField: React.FC<PasswordFieldProps> = ({
  value,
  onChange,
  t,
  disabled,
  required = true,
}) => (
  <div className="mb-4">
    <label htmlFor="password" className="block mb-1 font-medium">
      {t("signup.form.labels.password")}
    </label>
    <input
      id="password"
      type="password"
      required={required}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

export default PasswordField;
