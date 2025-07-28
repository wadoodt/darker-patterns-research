const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');

// Function to find key usages in codebase
function findKeyUsage(namespace, keyPath) {
  if (!namespace) return [];
  
  const fullKey = keyPath ? `${namespace}.${keyPath}` : namespace;
  
  // Simplified search pattern - looks for the exact key in t() calls
  const pattern = `t\(['"]${fullKey.replace(/\./g, '\\\\\\.')}['"]\)`;
  
  const usages = new Set();
  
  // Search all relevant source files
  const srcFiles = glob.sync('src/**/*.{js,jsx,ts,tsx}', { ignore: 'src/locales/**' });
  
  srcFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const regex = new RegExp(pattern, 'g');
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        usages.add(path.relative(process.cwd(), file));
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message);
    }
  });
  
  return Array.from(usages);
}

// Recursive function to process translation objects
function processTranslationObject(obj, namespace, currentPath = '') {
  // Check if this is a translation entry (has both en and es)
  if (obj.en && obj.es) {
    const fullKey = currentPath ? `${currentPath}` : namespace;
    const usages = findKeyUsage(namespace, fullKey);
    
    obj.usedOn = Array.isArray(obj.usedOn) 
      ? [...new Set([...obj.usedOn, ...usages])]
      : usages;
      
    if (typeof obj.notes !== 'string') {
      obj.notes = '';
    }
    return;
  }
  
  // Process nested objects
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      processTranslationObject(obj[key], namespace, newPath);
    }
  }
}

// Process a combined translation file
function verifyCombinedFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const verifiedData = {
    metadata: {
      namespace: data.metadata?.namespace || path.basename(filePath, '.combined.json')
    },
    ...data
  };
  
  console.log(`\nProcessing ${verifiedData.metadata.namespace} translations:`);
  
  // Process all top-level keys that aren't metadata
  for (const key in verifiedData) {
    if (key !== 'metadata' && typeof verifiedData[key] === 'object') {
      processTranslationObject(verifiedData[key], verifiedData.metadata.namespace);
    }
  }
  
  const verifiedPath = filePath.replace('.combined.json', '.combined.verified.json');
  fs.writeFileSync(
    verifiedPath, 
    JSON.stringify(verifiedData, null, 2)
  );
  console.log(`\nProcessed file saved to: ${verifiedPath}`);
}

// Main execution
const combinedFiles = [
  'articles.combined.json',
  'auth.combined.json',
  'common.combined.json',
  'config.combined.json',
  'error.combined.json',
  'pagination.combined.json',
  'pricing.combined.json',
  'profile.combined.json',
  'response.combined.json',
  'settings.combined.json',
  'shared.combined.json',
  'sidebar.combined.json',
  'support.combined.json',
  'team.combined.json',
  'tickets.combined.json',
  'ui.combined.json',
];

combinedFiles.forEach(file => {
  const filePath = path.join(__dirname, 'src/locales', file);
  if (fs.existsSync(filePath)) {
    verifyCombinedFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
