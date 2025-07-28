import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const LANGUAGES = ['en', 'es'];
// Only check these specific translation files
const CHECK_FILES = [
  'common.json',
  'pages/articles.json',
  'pages/config.json'
];

async function compareKeys(baseLang, compareLang) {
  let hasErrors = false;

  for (const file of CHECK_FILES) {
    const basePath = path.join(LOCALES_DIR, baseLang, file);
    const comparePath = path.join(LOCALES_DIR, compareLang, file);
    
    if (!fs.existsSync(basePath) || !fs.existsSync(comparePath)) {
      console.error(`🚨 Missing file: ${file} in one language`);
      hasErrors = true;
      continue;
    }

    const baseContent = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
    const compareContent = JSON.parse(fs.readFileSync(comparePath, 'utf-8'));

    // Compare keys recursively
    compareObjects(baseContent, compareContent, file);
  }

  return hasErrors;
}

function compareObjects(baseObj, compareObj, context, prefix = '') {
  const baseKeys = Object.keys(baseObj);
  const compareKeys = Object.keys(compareObj);

  // Check for keys missing in compare language
  baseKeys.forEach(key => {
    if (!compareKeys.includes(key)) {
      console.error(`❌ Missing key: ${prefix}${key} in ${context}`);
    }
  });

  // Check for extra keys in compare language
  compareKeys.forEach(key => {
    if (!baseKeys.includes(key)) {
      console.warn(`⚠️ Extra key: ${prefix}${key} in ${context}`);
    }
  });

  // Recursively compare nested objects
  baseKeys.forEach(key => {
    if (compareKeys.includes(key) && 
        typeof baseObj[key] === 'object' && 
        typeof compareObj[key] === 'object') {
      compareObjects(baseObj[key], compareObj[key], context, `${prefix}${key}.`);
    }
  });
}

// Main execution
console.log('🔍 Checking translation parity between English and Spanish...');
compareKeys('en', 'es')
  .then(hasErrors => {
    if (hasErrors) {
      console.error('❌ Translation parity check failed');
      process.exit(1);
    } else {
      console.log('✅ All translation keys match between English and Spanish');
    }
  })
  .catch(err => {
    console.error('Error during translation validation:', err);
    process.exit(1);
  });
