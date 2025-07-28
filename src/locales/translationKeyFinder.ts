import { execSync } from 'child_process';

export type KeyUsage = {
  file: string;
  lineNumber: number;
  content: string;
};

export function findTranslationKeyUsage(key: string, searchDir = '/home/israel/personal/code/penguinmails-dashboard'): KeyUsage[] {
  try {
    const command = `grep -n -r "t(\\"${key}\\")" ${searchDir} --include="*.ts" --include="*.tsx"`;
    const output = execSync(command).toString();
    
    return output.split('\n').filter(Boolean).map(line => {
      const [file, lineNumber, ...content] = line.split(':');
      return { 
        file, 
        lineNumber: parseInt(lineNumber, 10),
        content: content.join(':').trim() 
      };
    });
  } catch (error) {
    console.error('Error finding translation key usage:', error);
    return [];
  }
}
