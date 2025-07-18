import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Heading, Text, Button } from '@radix-ui/themes';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

    public static getDerivedStateFromError(): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box style={{ textAlign: 'center', marginTop: '50px' }}>
          <Heading size="8">Something went wrong.</Heading>
          <Text as="p" size="4" my="3">
            We've been notified of the issue and are working to fix it.
          </Text>
          <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
