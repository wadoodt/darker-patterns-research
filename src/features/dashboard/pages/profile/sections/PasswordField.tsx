import { useState } from "react";
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextField, Button } from "@radix-ui/themes";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showStrengthMeter?: boolean;
  showError?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  onBlur?: () => void;
}

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  showStrengthMeter = false,
  showError = false,
  errorMessage = "",
  autoComplete = "current-password",
  onBlur,
}: PasswordFieldProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <label>
      <Text as="div" size="2" mb="1" weight="medium">
        {label}
      </Text>
      <TextField.Root
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
      >
        <TextField.Slot>
          <Button
            variant="ghost"
            onClick={togglePasswordVisibility}
            type="button"
            aria-label={
              showPassword
                ? t("profile.security.changePassword.hidePassword")
                : t("profile.security.changePassword.showPassword")
            }
            onBlur={onBlur}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </TextField.Slot>
      </TextField.Root>
      {showStrengthMeter && (
        <div className="mt-2">
          {/* Password strength meter will be rendered here */}
        </div>
      )}
      {showError && errorMessage && (
        <Text size="1" color="red" mt="1">
          {errorMessage}
        </Text>
      )}
    </label>
  );
}
