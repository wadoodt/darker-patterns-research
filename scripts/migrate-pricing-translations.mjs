import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const enPath = path.join(projectRoot, 'src/locales/en/pages/pricing.json');
const esPath = path.join(projectRoot, 'src/locales/es/pages/pricing.json');
const outputPath = path.join(projectRoot, 'src/locales/pricing.combined.json');

const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const esTranslations = JSON.parse(fs.readFileSync(esPath, 'utf-8'));

const flatten = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    const key = pre + k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flatten(obj[k], key));
    } else {
      acc[key] = obj[k];
    }
    return acc;
  }, {});
};

const flatEn = flatten(enTranslations);
const flatEs = flatten(esTranslations);

const combinedTranslations = {};

for (const key in flatEn) {
  if (Object.prototype.hasOwnProperty.call(flatEn, key)) {
    if (!combinedTranslations[key]) {
      combinedTranslations[key] = {};
    }
    combinedTranslations[key].en = flatEn[key];
  }
}

for (const key in flatEs) {
  if (Object.prototype.hasOwnProperty.call(flatEs, key)) {
    if (!combinedTranslations[key]) {
      combinedTranslations[key] = {};
    }
    combinedTranslations[key].es = flatEs[key];
  }
}

const output = {
  metadata: {
    namespace: 'pricing',
    description: 'Translations for the pricing page',
    lastUpdated: new Date().toISOString().split('T')[0],
  },
  translations: combinedTranslations,
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

console.log(`Successfully migrated pricing translations to ${outputPath}`);
