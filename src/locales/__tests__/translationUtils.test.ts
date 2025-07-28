import { findTranslationKeyUsage } from '../translationUtils';

describe('findTranslationKeyUsage', () => {
  it('should find usage of articles.category', async () => {
    const usages = await findTranslationKeyUsage('articles.category');
    console.log('Found usages:', usages);
    expect(usages.length).toBeGreaterThan(0);
    expect(usages[0].file).toContain('ArticlesTableSection.tsx');
  });
});
