import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const enProfilePath = path.join(__dirname, '../src/locales/en/pages/profile.json');
const esProfilePath = path.join(__dirname, '../src/locales/es/pages/profile.json');
const combinedOutputPath = path.join(__dirname, '../src/locales/profile.combined.json');

const enProfile = JSON.parse(fs.readFileSync(enProfilePath, 'utf-8'));
const esProfile = JSON.parse(fs.readFileSync(esProfilePath, 'utf-8'));

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

const flatEn = flattenObject(enProfile);
const flatEs = flattenObject(esProfile);

const combinedTranslations = {
  metadata: {
    namespace: 'profile',
    description: 'User profile and settings translations',
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

console.log('Profile translations migrated successfully!');
