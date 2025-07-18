import React from 'react';
import { Button as RadixButton } from '@radix-ui/themes';
import type { ButtonProps } from '@radix-ui/themes';
import { useApp } from '@hooks/useApp';

// Create a custom Button component that automatically handles high contrast
const Button: React.FC<ButtonProps> = (props) => {
  const { isHighContrast } = useApp();

  return <RadixButton {...props} highContrast={isHighContrast} />;
};

export default Button;
