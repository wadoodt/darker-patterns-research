import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// File paths
const combinedPath = path.join(__dirname, '../src/locales/ui.combined.json');
const enPath = path.join(__dirname, '../src/locales/en/ui.json');
const esPath = path.join(__dirname, '../src/locales/es/ui.json');
const dtsPath = path.join(__dirname, '../src/locales/en/ui.d.ts');

// Read files
const combined = JSON.parse(fs.readFileSync(combinedPath, 'utf-8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const es = JSON.parse(fs.readFileSync(esPath, 'utf-8'));
const dts = fs.readFileSync(dtsPath, 'utf-8');

// Verification functions
function verifyTranslations() {
  let errors = 0;
  
  // Check English translations
  for (const [section, sectionData] of Object.entries(en)) {
    for (const [key, value] of Object.entries(sectionData)) {
      const combinedKey = `${section}.${key}`;
      
      if (typeof value === 'object') {
        // Handle nested objects
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          const fullKey = `${combinedKey}.${nestedKey}`;
          
          if (!combined.translations[fullKey]) {
            console.error(`Missing English translation for ${fullKey}`);
            errors++;
          } else if (combined.translations[fullKey].en !== nestedValue) {
            console.error(`Mismatch for ${fullKey} (en):
  Combined: "${combined.translations[fullKey].en}"
  Source:   "${nestedValue}"`);
            errors++;
          }
        }
      } else {
        if (!combined.translations[combinedKey]) {
          console.error(`Missing English translation for ${combinedKey}`);
          errors++;
        } else if (combined.translations[combinedKey].en !== value) {
          console.error(`Mismatch for ${combinedKey} (en):
  Combined: "${combined.translations[combinedKey].en}"
  Source:   "${value}"`);
          errors++;
        }
      }
    }
  }
  
  // Check Spanish translations
  for (const [section, sectionData] of Object.entries(es)) {
    for (const [key, value] of Object.entries(sectionData)) {
      const combinedKey = `${section}.${key}`;
      
      if (typeof value === 'object') {
        // Handle nested objects
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          const fullKey = `${combinedKey}.${nestedKey}`;
          
          if (!combined.translations[fullKey]) {
            console.error(`Missing Spanish translation for ${fullKey}`);
            errors++;
          } else if (combined.translations[fullKey].es !== nestedValue) {
            console.error(`Mismatch for ${fullKey} (es):
  Combined: "${combined.translations[fullKey].es}"
  Source:   "${nestedValue}"`);
            errors++;
          }
        }
      } else {
        if (!combined.translations[combinedKey]) {
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
  }
  
  return errors;
}

// Run verification
console.log('Verifying UI translations...');
const errorCount = verifyTranslations();

if (errorCount === 0) {
  console.log('✅ All UI translations match between combined and source files');
} else {
  console.log(`❌ Found ${errorCount} discrepancies`);
}
