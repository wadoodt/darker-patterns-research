import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const enSharedPath = path.join(__dirname, '../src/locales/en/shared.json');
const esSharedPath = path.join(__dirname, '../src/locales/es/shared.json');
const combinedOutputPath = path.join(__dirname, '../src/locales/shared.combined.json');

const enShared = JSON.parse(fs.readFileSync(enSharedPath, 'utf-8'));
const esShared = JSON.parse(fs.readFileSync(esSharedPath, 'utf-8'));

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

const flatEn = flattenObject(enShared);
const flatEs = flattenObject(esShared);

const combinedTranslations = {
  metadata: {
    namespace: 'shared',
    description: 'Shared translations for common UI elements like buttons, and status messages.',
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  translations: {},
};

for (const key in flatEn) {
  if (Object.prototype.hasOwnProperty.call(flatEn, key)) {
    combinedTranslations.translations[key] = {
      en: flatEn[key],
      es: flatEs[key] || '', // Default to empty string if no Spanish translation
      usedOn: [],
      notes: '',
    };
  }
}

fs.writeFileSync(combinedOutputPath, JSON.stringify(combinedTranslations, null, 2));

console.log('Shared translations migrated successfully!');
