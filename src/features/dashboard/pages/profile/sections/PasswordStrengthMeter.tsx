import { Box, Text } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";
import styles from "./PasswordStrengthMeter.module.css";

interface PasswordStrengthProps {
  password?: string;
}

type StrengthLevel =
  | "tooWeak"
  | "weak"
  | "fair"
  | "good"
  | "strong"
  | "veryStrong";

interface StrengthInfo {
  level: StrengthLevel;
  className: string;
}

export function PasswordStrengthMeter({
  password = "",
}: PasswordStrengthProps) {
  const { t } = useTranslation();

  const getPasswordStrength = (pass: string): StrengthInfo => {
    if (pass.length === 0)
      return { level: "tooWeak", className: styles.tooWeak };

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;

    if (strength <= 1) return { level: "weak", className: styles.weak };
    if (strength <= 2) return { level: "fair", className: styles.fair };
    if (strength <= 3) return { level: "good", className: styles.good };
    if (strength <= 4) return { level: "strong", className: styles.strong };
    return { level: "veryStrong", className: styles.veryStrong };
  };

  if (!password) return null;

  const strength = getPasswordStrength(password);
  const strengthLabel = t(
    `profile.security.passwordStrength.${strength.level}`,
  );

  return (
    <Box className={styles.container}>
      <div className={styles.strengthContainer}>
        <Text size="1" color="gray">
          {t("profile.security.passwordStrength.label")}
        </Text>
        <Text size="1" weight="medium">
          {strengthLabel}
        </Text>
      </div>
      <div className={styles.strengthMeter}>
        <div className={`${styles.strengthBar} ${strength.className}`} />
      </div>
    </Box>
  );
}
