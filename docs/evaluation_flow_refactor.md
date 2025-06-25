# Evaluation Flow Refactor

## Background / Current Issue

Currently, participants rate their **confidence** in the option they chose (1-5 stars).  
This metric is hard to interpret during analysis. What we _really_ need is a measure of **agreement** between the participant and the researcher (option & categories).

At the same time, participants can submit the evaluation immediately after choosing an option, which means we cannot show them the researcher’s choice and collect their reaction.

## Goals

1. **Two-step interaction**
   1. Participant selects A/B option & one or more categories.
   2. Participant presses **“Compare with Researchers”**.
   3. System reveals researcher’s option & researcher’s categories.
   4. Participant leaves optional comment, Likert 1-5 rating (“I do **not** agree – I **totally** agree”) and can flag the entry.
   5. Participant submits.
2. **Rating reframed** as agreement (Likert, 1 = strongly disagree, 5 = strongly agree).
3. Prevent premature submission – “Submit” only appears after reveal.
4. Preserve existing data shape where possible; new fields clearly versioned.
5. Better admin filtering (e.g. low-agreement entries).

## Implementation Plan (High-level)

| #                                                                                                                                           | Area                  | Action                                                                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1                                                                                                                                           | **State**             | Add `isRevealed` boolean to `useEntryReviewState`. Reset on entry change.                                                                                                                                   |
| 2                                                                                                                                           | **UI – Step Content** | In `EntryReviewStepContentView` render:                                                                                                                                                                     |
| \* **Pre-reveal**: option buttons, categories selector, **Compare with Researchers** button (disabled until option & ≥1 category selected). |
| 3                                                                                                                                           | **Reveal Logic**      | When the button clicked: set `isRevealed=true`; do **NOT** submit; show researcher option & category match indicators.                                                                                      |
| 4                                                                                                                                           | **Rating Section**    | Move inside a conditional block visible _only_ when `isRevealed===true`. Update label text to:                                                                                                              |
| `"How strongly do you agree with the researcher’s option & categories? (1 = disagree, 5 = agree)"`                                          |
| 5                                                                                                                                           | **Submit**            | Only show **Submit** after reveal. Validation requires: option selected, rating > 0.                                                                                                                        |
| 6                                                                                                                                           | **Mutation Layer**    | Reuse existing `buildEvaluationDraft`; rename `confidenceRating` → `agreementRating` (non-breaking alias) or store new field `agreementRating` alongside `confidenceRating` to keep old dashboards working. |
| 7                                                                                                                                           | **Flag & Comments**   | No change – already captured post-reveal.                                                                                                                                                                   |
| 8                                                                                                                                           | **Loading / UX**      | Add short fade-in for reveal; disable buttons during async.                                                                                                                                                 |
| 9                                                                                                                                           | **Docs**              | Update README & contributor docs.                                                                                                                                                                           |

### Out of Scope for this PR

- Changes to Admin dashboards or data export scripts – will be covered in a follow-up task.

## Key Code Locations

The primary areas to modify during this refactor are:

| Area                       | File / Component                                                   | Notes                                                                                  |
| -------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| **State management**       | `src/components/survey/useEntryReviewState.ts`                     | Add `isRevealed` and reset logic.                                                      |
| **Step logic**             | `src/components/survey/EntryReviewStepContent.tsx`                 | Trigger reveal, build evaluation draft, validation.                                    |
| **Step view (UI)**         | `src/components/survey/EntryReviewStepContentView.tsx`             | Conditional rendering of pre-reveal / post-reveal UI, rating label, submit visibility. |
| **Rating control**         | `src/components/survey/RatingSection.tsx`                          | Update prompt text & visibility.                                                       |
| **Evaluation build**       | `src/components/survey/evaluationUtils.ts`                         | Rename `confidenceRating` → `agreementRating`. Update object shape passed to backend.  |
| **Flag utils**             | `src/components/survey/flagUtils.ts`                               | No direct change, ensure reveal does not affect.                                       |
| **Mutations / submission** | `src/lib/survey/hooks/useSurveyMutations.ts`                       | Ensure new field passed to backend.                                                    |
| **Unsaved changes guard**  | `src/lib/survey/reducer.ts` & `contexts/SurveyProgressContext.tsx` | Verify logic still correct with two-step flow.                                         |
| **Route page**             | `src/app/(survey)/step-evaluation/page.tsx`                        | Ensure the page passes/receives new props if required.                                 |
| **Cloud Functions**        | `functions/src/index.ts`                                           | Adjust Firestore triggers/exports to read `agreementRating` field.                     |
| **Admin dashboards**       | `src/components/admin/...` & queries                               | Update tables, filters, and export CSV to use `agreementRating`.                       |
| **Export scripts**         | `functions/src/api/exportDpoDataset.ts`                            | Include `agreementRating` when exporting evaluations.                                  |

## Test Plan

### Manual Acceptance Tests

1. **Initial view**
   - User sees Option A/B & category selector only.
   - "Compare with Researchers" disabled until option + category chosen.
2. **Reveal step**
   - Clicking the button reveals researcher option & category match (✓ / ✗ icons).
   - Rating control now visible, label updated.
   - Submit button visible and enabled **only** after user selects a rating.
3. **Validation**
   - Trying to submit without rating shows inline error.
   - After submit, evaluation is stored with `agreementRating` (1-5) and correctly mapped chosen/accepted flags.
4. **Unsaved changes guard** works for both steps.
5. **Admin filter** (existing) continues to load evaluations (legacy + new).

### Automated Tests (Jest / React Testing Library)

- `useEntryReviewState` sets `isRevealed=false` on entry change.
- UI renders correct controls pre- and post-reveal.
- Submit disabled until all conditions met.
- Rating label text updated.

## Rollback Plan

All changes are front-end only. If issues arise we can flip a feature flag (`REVEAL_FLOW_ENABLED`) to restore current one-step flow.

---

_Document generated on 2025-06-25 by Cascade._
