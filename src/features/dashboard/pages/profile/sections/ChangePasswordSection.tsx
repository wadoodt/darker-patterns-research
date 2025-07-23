import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Heading, Flex, Button, Card } from "@radix-ui/themes";
import { PasswordField } from "./PasswordField";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import styles from "./ChangePasswordSection.module.css";

export function ChangePasswordSection() {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordMismatch, setShowPasswordMismatch] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setShowPasswordMismatch(true);
      return;
    }

    if (newPassword.length < 8) {
      alert(t("profile.security.changePassword.errors.tooShort"));
      return;
    }

    // Handle password change logic here
    console.log("Changing password...");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordMismatch(false);
  };

  const handlePasswordBlur = () => {
    setShowPasswordMismatch(
      !!confirmPassword && newPassword !== confirmPassword,
    );
  };

  const isSubmitDisabled =
    !currentPassword ||
    !newPassword ||
    !confirmPassword ||
    newPassword !== confirmPassword;

  return (
    <Card>
      <Heading as="h3" size="4" mb="4">
        {t("profile.security.changePassword.title")}
      </Heading>

      <form onSubmit={handlePasswordChange}>
        <Flex direction="column" gap="4">
          <PasswordField
            label={t("profile.security.changePassword.currentPassword")}
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder={t(
              "profile.security.changePassword.placeholders.current",
            )}
            autoComplete="current-password"
          />

          <PasswordField
            label={t("profile.security.changePassword.newPassword")}
            value={newPassword}
            onChange={setNewPassword}
            placeholder={t("profile.security.changePassword.placeholders.new")}
            showStrengthMeter={true}
            autoComplete="new-password"
          />
          {newPassword && <PasswordStrengthMeter password={newPassword} />}

          <PasswordField
            label={t("profile.security.changePassword.confirmPassword")}
            value={confirmPassword}
            onChange={setConfirmPassword}
            onBlur={handlePasswordBlur}
            placeholder={t(
              "profile.security.changePassword.placeholders.confirm",
            )}
            showError={showPasswordMismatch}
            errorMessage={t("profile.security.changePassword.errors.mismatch")}
            autoComplete="new-password"
          />

          <Box pt="2">
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className={styles.button}
            >
              {t("profile.security.changePassword.submit")}
            </Button>
          </Box>
        </Flex>
      </form>
    </Card>
  );
}
