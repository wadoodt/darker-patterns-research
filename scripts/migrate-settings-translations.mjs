import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const settingsFilePath = path.join(__dirname, '../src/locales/settings.combined.json');

const oldSettings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8'));

const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const flatEn = flattenObject(oldSettings.en.settings);
const flatEs = flattenObject(oldSettings.es.settings);
const oldMetadata = oldSettings.metadata || { usedOn: {}, notes: {} };

const newCombinedTranslations = {
  metadata: {
    namespace: 'settings',
    description: 'Translations for all user and application settings.',
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  translations: {},
};

for (const key in flatEn) {
  if (Object.prototype.hasOwnProperty.call(flatEn, key)) {
    newCombinedTranslations.translations[key] = {
      en: flatEn[key],
      es: flatEs[key] || '',
      usedOn: oldMetadata.usedOn[key] || [],
      notes: oldMetadata.notes[key] || '',
    };
  }
}

fs.writeFileSync(settingsFilePath, JSON.stringify(newCombinedTranslations, null, 2));

console.log('Settings translations migrated successfully to the new format!');
