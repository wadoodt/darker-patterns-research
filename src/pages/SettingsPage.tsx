import React from 'react';
import { Box, Button, Flex, Heading, Text } from '@radix-ui/themes';
import { useAuth } from '../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { hasRole } = useAuth();

  return (
    <Box p="4">
      <Heading as="h2" size="6" mb="4">Settings</Heading>
      <Flex direction="column" gap="4">
        <Box>
          <Heading as="h3" size="4" mb="2">System-Wide Actions</Heading>
          {hasRole(["super-admin"]) ? (
            <Button color="red">Emergency Shutdown</Button>
          ) : (
            <Text color="gray">You do not have permission to perform system-wide actions.</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SettingsPage;

