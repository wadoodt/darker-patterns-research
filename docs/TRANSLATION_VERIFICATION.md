# Translation Key Verification Process

## Overview
This document explains the workflow for verifying and maintaining translation key usage metadata (`usedOn` fields) in the codebase.

## Key Components
1. `testTranslationUsage.cjs` - CLI utility to verify translation key usages
2. Combined translation files (e.g. `articles.combined.json`)
3. Language-specific files (e.g. `en/pages/articles.json`)

## Workflow
1. **Run Verification**:
   ```bash
   node testTranslationUsage.cjs
   ```
   This will:
   - Scan the codebase for all `t("key")` usages
   - Compare with declared `usedOn` paths in combined files
   - Generate `.verified.json` files with corrected paths

2. **Review Changes**:
   ```bash
   diff src/locales/articles.combined.json src/locales/articles.combined.verified.json
   ```

3. **Apply Updates**:
   ```bash
   mv src/locales/articles.combined.verified.json src/locales/articles.combined.json
   ```

## Special Cases
- **Shared Namespace**: Uses descriptive `usedOn` values rather than file paths
- **Missing Translations**: English used as fallback for missing Spanish translations

## Maintenance
Run verification:
1. After adding new translation keys
2. When moving/renaming components
3. As part of CI/CD pipeline

## Key Findings from Verification

1. **Unused Translation Keys**: 
   - Several translation keys were found to have empty `usedOn` arrays
   - These include keys in `sidebar.combined.json` and `support.combined.json`
   - Recommendation: Review these keys and either:
     - Add usage in the codebase
     - Move to shared translations if commonly needed
     - Remove if no longer needed

2. **usedOn Metadata Accuracy**:
   - The verification process revealed some inconsistencies in `usedOn` arrays
   - Some keys showed usage in files where they weren't actually used
   - Recommendation: Periodically verify `usedOn` arrays with:
     ```bash
     node testTranslationUsage.cjs src/locales/[namespace].combined.json
     ```

3. **Cleanup Recommendations**:
   - Perform a full audit of all translation keys with empty `usedOn` arrays
   - Consider creating a script to automatically flag unused translations
   - Document decisions about keeping unused translations (e.g. for future features)

## Notes
- Paths are relative to project root
- `usedOn` fields help track where translations are used
- Combined files serve as the source of truth
- **Shared translations**: Currently unused keys in `shared` namespace should be reviewed and potentially moved to appropriate namespaces in the future
