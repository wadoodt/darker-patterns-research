import React from 'react';
import { Box, Button, Flex, TextField, Text } from '@radix-ui/themes';

interface LoginViewProps {
  onSubmit: (event: React.FormEvent) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  error: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ onSubmit, onUsernameChange, onPasswordChange, error }) => {
  return (
    <Box maxWidth="300px" mx="auto" my="9">
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="3">
          <Text size="5" weight="bold" align="center">Login</Text>
          <TextField.Root
            placeholder="Username"
            size="3"
            onChange={(e) => onUsernameChange(e.target.value)}
          />
          <TextField.Root
            placeholder="Password"
            type="password"
            size="3"
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          {error && <Text color="red" size="2">{error}</Text>}
          <Button size="3" type="submit">Log in</Button>
        </Flex>
      </form>
    </Box>
  );
};

export default LoginView;

