import { useState } from "react";
import {
  Heading,
  Grid,
  Flex,
  Box,
  Text,
  TextField,
  TextArea,
  Button,
  Callout,
} from "@radix-ui/themes";
import { CheckCircleIcon, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "@api/client";

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
  submit: string;
}

export const ContactFormSection = () => {
  const { t } = useTranslation();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = t("support.contact_form.fields", {
    returnObjects: true,
  }) as FormFields;

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      setError(t("validation.required_fields"));
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setError(t("validation.invalid_email"));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/support/contact", contactForm);
      setFormSubmitted(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(t("support.contact_form.error.message"));
      console.error("Contact form submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxWidth="700px" mx="auto">
      <Heading as="h2" size="6" mb="2" align="center">
        {t("support.contact_form.title")}
      </Heading>
      <Text align="center" color="gray" mb="6">
        {t("support.contact_form.subtitle")}
      </Text>

      {error && (
        <Callout.Root color="red" role="alert" mb="4">
          <Callout.Icon>
            <AlertTriangle />
          </Callout.Icon>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}

      {formSubmitted ? (
        <Callout.Root color="green" role="alert">
          <Callout.Icon>
            <CheckCircleIcon />
          </Callout.Icon>
          <Callout.Text>
            {t("support.contact_form.success.message")}
          </Callout.Text>
        </Callout.Root>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <Grid columns={{ initial: "1", sm: "2" }} gap="4">
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="name" size="2" weight="medium">
                {fields.name}
              </Text>
              <TextField.Root
                id="name"
                placeholder={fields.name}
                required
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" htmlFor="email" size="2" weight="medium">
                {fields.email}
              </Text>
              <TextField.Root
                id="email"
                type="email"
                placeholder={fields.email}
                required
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </Flex>
          </Grid>
          <Flex direction="column" gap="1">
            <Text as="label" htmlFor="subject" size="2" weight="medium">
              {fields.subject}
            </Text>
            <TextField.Root
              id="subject"
              placeholder={fields.subject}
              required
              value={contactForm.subject}
              onChange={(e) =>
                setContactForm((prev) => ({ ...prev, subject: e.target.value }))
              }
            />
          </Flex>
          <Flex direction="column" gap="1">
            <Text as="label" htmlFor="message" size="2" weight="medium">
              {fields.message}
            </Text>
            <TextArea
              id="message"
              placeholder={fields.message}
              required
              rows={5}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm((prev) => ({ ...prev, message: e.target.value }))
              }
            />
          </Flex>
          <Button type="submit" size="3" disabled={isLoading}>
            {isLoading
              ? t("common.sending")
              : t("support.contact_form.fields.submit")}
          </Button>
        </form>
      )}
    </Box>
  );
};
