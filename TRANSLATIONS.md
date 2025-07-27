# Translation Guidelines

## Best Practices
1. **Consistent Namespaces**: Use predefined namespace constants for all translations
2. **Complete Translations**: Always add both English and Spanish translations
3. **Immediate Registration**: Register new translation files in i18n.ts immediately
4. **No Hardcoded Text**: Use translation keys instead of hardcoded strings in components
5. **Validation**: Run `npm run validate-translations` before committing

## Namespace Standards
```typescript
// Use these namespace constants
const namespaces = {
  COMMON: 'common',
  ARTICLES: 'articles',
  CONFIG: 'config',
  SUPPORT: 'support',
  PROFILE: 'profile'
};
```

## Workflow
1. Add keys to English translation file first
2. Add corresponding Spanish translations
3. Register in i18n.ts
4. Run validation script
5. Update components to use new keys

## Troubleshooting
- Missing key warnings? Check:
  - File exists in both languages
  - Keys match exactly
  - File is imported in i18n.ts
  - Component uses correct namespace
