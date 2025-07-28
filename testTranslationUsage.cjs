const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to find key usages in codebase
function findKeyUsage(namespace, key) {
  const searchDir = path.join(__dirname, 'src');
  const fullKey = `${namespace}.${key}`;
  const command = `grep -rl "t('${fullKey}')" ${searchDir}`;

  try {
    const output = execSync(command).toString();
    return output.split('\n').filter(Boolean).map(file => path.relative(searchDir, file));
  } catch (error) {
    return [];
  }
}

// Process a combined translation file
function verifyCombinedFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const namespace = data.metadata && data.metadata.namespace || path.basename(filePath, '.combined.json');
  const verifiedData = JSON.parse(JSON.stringify(data)); // Deep clone
  
  console.log(`\nVerifying ${namespace} translations:`);
  
  const translations = verifiedData.translations;

  for (const key in translations) {
    if (Object.hasOwnProperty.call(translations, key)) {
      const usages = findKeyUsage(namespace, key);
      translations[key].usedOn = [...new Set([...(translations[key].usedOn || []), ...usages])];
    }
  }
  
  const verifiedPath = filePath.replace('.combined.json', '.combined.verified.json');
  fs.writeFileSync(
    verifiedPath, 
    JSON.stringify(verifiedData, null, 2)
  );
  console.log(`\nVerified file saved to: ${verifiedPath}`);
}

// Main execution
const combinedFiles = [
  'team.combined.json',
  'support.combined.json',
  // Add other combined files as needed
];

combinedFiles.forEach(file => {
  const filePath = path.join(__dirname, 'src/locales', file);
  if (fs.existsSync(filePath)) {
    verifyCombinedFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
