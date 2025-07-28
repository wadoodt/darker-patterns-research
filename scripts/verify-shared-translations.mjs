import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// File paths
const combinedPath = path.join(__dirname, '../src/locales/shared.combined.json');
const enPath = path.join(__dirname, '../src/locales/en/shared.json');
const esPath = path.join(__dirname, '../src/locales/es/shared.json');

// Read files
const combinedFile = JSON.parse(fs.readFileSync(combinedPath, 'utf-8'));
const enFile = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const esFile = JSON.parse(fs.readFileSync(esPath, 'utf-8'));

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

const flatEn = flattenObject(enFile);
const flatEs = flattenObject(esFile);
const combinedTranslations = combinedFile.translations;

let discrepancies = 0;
console.log('--- Verifying shared.combined.json ---');

for (const key in combinedTranslations) {
  if (Object.prototype.hasOwnProperty.call(combinedTranslations, key)) {
    const enCombined = combinedTranslations[key].en;
    const esCombined = combinedTranslations[key].es;
    const enSource = flatEn[key];
    const esSource = flatEs[key];

    if (enCombined !== enSource) {
      console.error(`[MISMATCH] Key: ${key} (en)`);
      console.error(`  - Combined: "${enCombined}"`);
      console.error(`  - Source:   "${enSource}"`);
      discrepancies++;
    }

    if (esCombined !== esSource) {
      console.error(`[MISMATCH] Key: ${key} (es)`);
      console.error(`  - Combined: "${esCombined}"`);
      console.error(`  - Source:   "${esSource}"`);
      discrepancies++;
    }
  }
}

for (const key in flatEn) {
    if (!combinedTranslations[key]) {
        console.error(`[MISSING] Key from source missing in combined file: ${key}`);
        discrepancies++;
    }
}

if (discrepancies === 0) {
  console.log('✅ Verification successful: All keys and values are consistent.');
} else {
  console.log(`
❌ Verification failed: Found ${discrepancies} discrepancies.`);
}
