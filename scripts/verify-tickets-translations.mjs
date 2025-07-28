import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// File paths
const combinedPath = path.join(__dirname, '../src/locales/tickets.combined.json');
const enPath = path.join(__dirname, '../src/locales/en/pages/tickets.json');
const esPath = path.join(__dirname, '../src/locales/es/pages/tickets.json');
const dtsPath = path.join(__dirname, '../src/locales/es/pages/tickets.d.ts');

// Read files
const combined = JSON.parse(fs.readFileSync(combinedPath, 'utf-8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf-8'));
const dts = fs.readFileSync(dtsPath, 'utf-8');

// Verification functions
function verifyTranslations() {
  let errors = 0;
  
  // Check English translations
  for (const [key, value] of Object.entries(en)) {
    if (typeof value === 'object') {
      // Handle nested objects (like status)
      if (!combined.translations[key]) {
        console.error(`Missing English translation object for tickets.${key}`);
        errors++;
      } else {
        // Check each nested property
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (!combined.translations[key].en[nestedKey]) {
            console.error(`Missing nested English translation for tickets.${key}.${nestedKey}`);
            errors++;
          } else if (combined.translations[key].en[nestedKey] !== nestedValue) {
            console.error(`Mismatch for tickets.${key}.${nestedKey} (en):
  Combined: "${combined.translations[key].en[nestedKey]}"
  Source:   "${nestedValue}"`);
            errors++;
          }
        }
      }
    } else if (!combined.translations[key]) {
      console.error(`Missing English translation for tickets.${key}`);
      errors++;
    } else if (combined.translations[key].en !== value) {
      console.error(`Mismatch for tickets.${key} (en):
  Combined: "${combined.translations[key].en}"
  Source:   "${value}"`);
      errors++;
    }
  }
  
  // Check Spanish translations
  for (const [key, value] of Object.entries(es)) {
    if (!combined.translations[key]) {
      console.error(`Missing Spanish translation for tickets.${key}`);
      errors++;
    } else if (typeof value === 'object') {
      // Handle nested objects (like status)
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        if (!combined.translations[key].es[nestedKey]) {
          console.error(`Missing nested Spanish translation for tickets.${key}.${nestedKey}`);
          errors++;
        }
      }
    } else if (combined.translations[key].es !== value) {
      console.error(`Mismatch for tickets.${key} (es):
  Combined: "${combined.translations[key].es}"
  Source:   "${value}"`);
      errors++;
    }
  }
  
  return errors;
}

// Run verification
console.log('Verifying tickets translations...');
const errorCount = verifyTranslations();

if (errorCount === 0) {
  console.log('✅ All tickets translations match between combined and source files');
} else {
  console.log(`❌ Found ${errorCount} discrepancies`);
}
