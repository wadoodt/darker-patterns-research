import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const enResponsePath = path.join(__dirname, '../src/locales/en/response.json');
const esResponsePath = path.join(__dirname, '../src/locales/es/response.json');
const combinedOutputPath = path.join(__dirname, '../src/locales/response.combined.json');

const enResponse = JSON.parse(fs.readFileSync(enResponsePath, 'utf-8'));
const esResponse = JSON.parse(fs.readFileSync(esResponsePath, 'utf-8'));

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

const flatEn = flattenObject(enResponse);
const flatEs = flattenObject(esResponse);

const combinedTranslations = {
  metadata: {
    namespace: 'response',
    description: 'API response messages and user feedback',
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

console.log('Response translations migrated successfully!');
