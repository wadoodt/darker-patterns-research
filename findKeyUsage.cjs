const { execSync } = require('child_process');

function findKeyUsage(key) {
  const searchDir = '/home/israel/personal/code/penguinmails-dashboard';
  const command = `grep -n -r "t(\\"${key}\\")" ${searchDir} --include="*.ts" --include="*.tsx"`;
  
  try {
    const output = execSync(command).toString();
    const results = output.split('\n').filter(Boolean).map(line => {
      const [file, lineNumber, ...content] = line.split(':');
      return { file, lineNumber, content: content.join(':').trim() };
    });
    
    console.log(`\nFound ${results.length} usages of ${key}:`);
    results.forEach(r => console.log(`- ${r.file}:${r.lineNumber} ${r.content}`));
    return results.length > 0;
  } catch (error) {
    console.log(`\nNo usages found for ${key}`);
    return false;
  }
}

// Get keys from command line arguments
const keys = process.argv.slice(2);

if (keys.length === 0) {
  console.log('Usage: node findKeyUsage.cjs [key1] [key2] ...');
  console.log('Example: node findKeyUsage.cjs articles.category articles.title');
} else {
  keys.forEach(findKeyUsage);
}
