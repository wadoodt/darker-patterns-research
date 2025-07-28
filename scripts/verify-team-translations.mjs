import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// File paths
const combinedPath = path.join(__dirname, '../src/locales/team.combined.json');
const enPath = path.join(__dirname, '../src/locales/en/pages/team.json');
const esPath = path.join(__dirname, '../src/locales/es/pages/team.json');
const dtsPath = path.join(__dirname, '../src/locales/en/pages/team.d.ts');

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
    if (!combined.en.team[key]) {
      console.error(`Missing English translation for team.${key}`);
      errors++;
    } else if (combined.en.team[key] !== value) {
      console.error(`Mismatch for team.${key} (en):
  Combined: "${combined.en.team[key]}"
  Source:   "${value}"`);
      errors++;
    }
  }
  
  // Check Spanish translations
  for (const [key, value] of Object.entries(es)) {
    if (!combined.es.team[key]) {
      console.error(`Missing Spanish translation for team.${key}`);
      errors++;
    } else if (combined.es.team[key] !== value) {
      console.error(`Mismatch for team.${key} (es):
  Combined: "${combined.es.team[key]}"
  Source:   "${value}"`);
      errors++;
    }
  }
  
  return errors;
}

// Run verification
console.log('Verifying team translations...');
const errorCount = verifyTranslations();

if (errorCount === 0) {
  console.log('✅ All team translations match between combined and source files');
} else {
  console.log(`❌ Found ${errorCount} discrepancies`);
}
