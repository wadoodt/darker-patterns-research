import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// File paths
const combinedPath = path.join(__dirname, '../src/locales/sidebar.combined.json');
const enPath = path.join(__dirname, '../src/locales/en/sidebar.json');
const esPath = path.join(__dirname, '../src/locales/es/sidebar.json');
const dtsPath = path.join(__dirname, '../src/locales/en/sidebar.d.ts');

// Read files
const combined = JSON.parse(fs.readFileSync(combinedPath, 'utf-8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf-8'));
const dts = fs.readFileSync(dtsPath, 'utf-8');

// Verification functions
function verifyTranslations() {
  let errors = 0;
  
  // Check English translations
  for (const [section, keys] of Object.entries(en)) {
    for (const [key, value] of Object.entries(keys)) {
      const combinedKey = `${section}.${key}`;
      if (!combined.translations[combinedKey]?.en) {
        console.error(`Missing English translation for ${combinedKey}`);
        errors++;
      } else if (combined.translations[combinedKey].en !== value) {
        console.error(`Mismatch for ${combinedKey}:
  Combined: "${combined.translations[combinedKey].en}"
  Source:   "${value}"`);
        errors++;
      }
    }
  }
  
  // Check Spanish translations
  for (const [section, keys] of Object.entries(es)) {
    for (const [key, value] of Object.entries(keys)) {
      const combinedKey = `${section}.${key}`;
      if (!combined.translations[combinedKey]?.es) {
        console.error(`Missing Spanish translation for ${combinedKey}`);
        errors++;
      } else if (combined.translations[combinedKey].es !== value) {
        console.error(`Mismatch for ${combinedKey} (es):
  Combined: "${combined.translations[combinedKey].es}"
  Source:   "${value}"`);
        errors++;
      }
    }
  }
  
  return errors;
}

// Run verification
console.log('Verifying sidebar translations...');
const errorCount = verifyTranslations();

if (errorCount === 0) {
  console.log('✅ All sidebar translations match between combined and source files');
} else {
  console.log(`❌ Found ${errorCount} discrepancies`);
}
