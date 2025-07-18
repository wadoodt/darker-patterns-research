import React from 'react';
import { Select } from '@radix-ui/themes';
import { useApp } from '@hooks/useApp';

const LanguageSelector: React.FC = () => {
  const { settings, updateSettings, availableLanguages } = useApp();

  const handleLanguageChange = (value: string) => {
    updateSettings({ language: value });
  };

  return (
    <Select.Root
      value={settings.language}
      onValueChange={handleLanguageChange}
    >
      <Select.Trigger aria-label="Select language" />
      <Select.Content>
        {availableLanguages.map((lang) => (
          <Select.Item key={lang.code} value={lang.code}>
            {lang.name}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};

export default LanguageSelector;
