import { Component, type ErrorInfo, type ReactNode, type ComponentType } from "react";
import { Box, Heading, Text, Button } from "@radix-ui/themes";
import { withTranslation, type WithTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface Props extends WithTranslation {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { t } = this.props;

    if (this.state.hasError) {
      const errorDetails = this.state.error?.toString();
      const mailtoLink = `mailto:support@penguinmails.com?subject=Bug%20Report&body=${encodeURIComponent(
        `Hello,\n\nI encountered an error. Here are the details:\n\n${errorDetails}`
      )}`;

      return (
        <Box style={{ textAlign: "center", marginTop: "50px" }}>
          <Heading size="8">{t("errorBoundary.title")}</Heading>
          <Text as="p" size="4" my="3">
            {t("errorBoundary.description")}
          </Text>
          <Text as="p" size="3" my="3">
            {t("errorBoundary.contactSupport")}{" "}
            <a href={mailtoLink}>{t("errorBoundary.reportLink")}</a>
          </Text>
          <details style={{ whiteSpace: "pre-wrap", margin: "20px" }}>
            <summary>{t("errorBoundary.errorDetails")}</summary>
            {errorDetails}
          </details>
          <Box style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              {t("errorBoundary.tryAgain")}
            </Button>
            <Link to="/dashboard">
              <Button>{t("errorBoundary.goToHome")}</Button>
            </Link>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

const TranslatedErrorBoundary: ComponentType<Omit<Props, keyof WithTranslation>> = withTranslation()(ErrorBoundary);

export default TranslatedErrorBoundary;

