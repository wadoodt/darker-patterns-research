interface TranslationMetadata {
  namespace: string;
  description?: string;
}

export type LegacyTranslations = Record<string, unknown>;

export type CombinedTranslationsFile = {
  metadata: TranslationMetadata;
  translations: Record<string, { 
    en: string; 
    es: string; 
    usedOn: string[];
    notes?: string; 
  }>;
};

export type LanguageResources = {
  [key: string]: {
    [key: string]: string;
  };
};

export type ProcessedTranslations = {
  en: Record<string, Record<string, string>>;
  es: Record<string, Record<string, string>>;
};

export function processCombinedTranslations(
  combined: CombinedTranslationsFile | LegacyTranslations,
  namespace: string
): ProcessedTranslations {
  const resources: ProcessedTranslations = {
    en: { [namespace]: {} },
    es: { [namespace]: {} },
  };

  const flattenTranslations = (
    obj: Record<string, unknown>,
    prefix = ''
  ): Record<string, { en: string; es: string }> => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : '';
      const currentValue = obj[k];
      if (typeof currentValue === 'object' && currentValue !== null) {
        if ('en' in currentValue && 'es' in currentValue) {
          const value = currentValue as { en: string; es: string };
          acc[pre + k] = { en: value.en, es: value.es };
        } else {
          Object.assign(acc, flattenTranslations(currentValue as Record<string, unknown>, pre + k));
        }
      }
      return acc;
    }, {} as Record<string, { en: string; es: string }>);
  };

  if (combined && typeof combined === 'object' && 'metadata' in combined && 'translations' in combined) {
    const combinedFile = combined as CombinedTranslationsFile;
    for (const [key, value] of Object.entries(combinedFile.translations)) {
      resources.en[namespace][key] = value.en;
      resources.es[namespace][key] = value.es;
    }
  } else if (combined && typeof combined === 'object') {
    const flatTranslations = flattenTranslations(combined as LegacyTranslations);
    for (const [key, value] of Object.entries(flatTranslations)) {
      resources.en[namespace][key] = value.en;
      resources.es[namespace][key] = value.es;
    }
  }

  return resources;
}
