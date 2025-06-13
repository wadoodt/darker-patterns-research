import type React from 'react';

export interface PasswordInputProps {
  field: {
    value: string;
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  };
}
