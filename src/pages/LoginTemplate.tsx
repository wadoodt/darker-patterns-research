
import React from 'react';
import LoginView from './LoginView';

interface LoginTemplateProps {
  onSubmit: (event: React.FormEvent) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  error: string | null;
}

const LoginTemplate: React.FC<LoginTemplateProps> = ({ onSubmit, onUsernameChange, onPasswordChange, error }) => {
  return (
    <LoginView
      onSubmit={onSubmit}
      onUsernameChange={onUsernameChange}
      onPasswordChange={onPasswordChange}
      error={error}
    />
  );
};

export default LoginTemplate;

