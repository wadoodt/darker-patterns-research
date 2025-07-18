import React from 'react';
import { Card, Heading } from '@radix-ui/themes';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => (
  <Card>
    <Heading as="h3" size="4" mb="4">
      {title}
    </Heading>
    {children}
  </Card>
);

export default SettingSection;
