# Application Workflow

This document outlines the complete workflow for the Darker Patterns Research project, from initial data ingestion to the final data release and project conclusion.

## Roles

- **Admin**: Manages the platform, user roles, data ingestion, and critical operations like opening/closing the survey and handling sensitive data.
- **Researcher**: Reviews and refines DPO entries, triages participant feedback, proposes revisions, and conducts data analysis.
- **Participant**: A member of the public who takes the survey, providing evaluations and feedback on DPO entries.

## Project Phases

```mermaid
graph TD
    subgraph Phase 1: Setup & Ingestion
        A[Admin: Ingests DPO Dataset]
    end

    subgraph Phase 2: Internal Review
        A --> B{Internal Review?}
        B -- Yes --> C[Researchers: Review & Refine Entries]
        B -- No --> D[Admin: Opens Public Survey]
        C --> D
    end

    subgraph Phase 3: Public Survey & Data Collection
        D --> E[Participants: Evaluate Entries & Submit Flags]
    end

    subgraph Phase 4: Iterative Improvement
        E --> F{Triage & Analysis}
        F --> G[Researchers: Analyze evaluations on /admin/evaluations]
        F --> H[Researchers: Triage flags on /admin/submissions]
        G --> I{Change Needed?}
        H --> I
        I -- Minor Fix --> J[Researcher/Admin: Edits entry via /admin/entries/[entryId]/edit]
        I -- Major Change --> K[Researcher: Proposes revision on /admin/revisions]
        K --> L[Admin: Reviews & Approves Revision]
        L --> J
        J --> E
        I -- No Change --> E
    end

    subgraph Phase 5: Survey Conclusion & Data Release
        M[Entries Reach Evaluation Target] --> N[Admin: Closes Survey]
        N --> O[Researchers: Final Data Analysis & Crunch]
        O --> P[Researchers: Publish Preprint]
        P --> Q[Admin: Notify Participants via Email]
        Q --> R[Admin: Anonymize Data & Dispose of Emails]
    end

    E -- Survey Period Ends --> M
```

### Phase 1: Setup and Ingestion

1.  **Admin Ingests Dataset**: The Admin uploads the initial DPO (Distilled Preference Optimization) dataset through the `/admin/entries` page.

### Phase 2: Internal Review (Optional)

1.  **Researchers Review**: Before public release, Researchers can review the initial entries, correcting typos or making minor refinements to ensure data quality.

### Phase 3: Public Survey

1.  **Admin Opens Survey**: The Admin makes the survey accessible to the public.
2.  **Participants Evaluate**: Participants take the survey, providing A/B evaluations for DPO entries and submitting flags for any entries they find problematic (e.g., offensive, inaccurate).

### Phase 4: Triage and Iteration

This is a continuous cycle of improvement.

1.  **Researchers Triage Feedback**:
    - **Flags**: User-submitted flags are triaged in `/admin/submissions`.
    - **Evaluations**: Performance and participant agreement are analyzed in `/admin/evaluations` to spot confusing or poorly performing entries.
2.  **Researchers Make Updates**:
    - **Minor Changes**: For simple fixes, a Researcher or Admin can edit an entry directly via `/admin/entries/[entryId]/edit`.
    - **Major Changes**: For significant updates requiring discussion, a Researcher proposes a formal change in `/admin/revisions`. An Admin then reviews and approves it.

### Phase 5: Survey Completion and Data Release

1.  **Close Survey**: Once entries have met their target number of evaluations, the Admin closes the public survey.
2.  **Final Analysis**: Researchers perform a final data crunch, cleaning and preparing the dataset for release.
3.  **Publish Preprint**: The research findings and the final dataset are published in a preprint.
4.  **Notify Participants**: The Admin sends a link to the preprint to all participants who consented to be contacted by providing their email.
5.  **Dispose of Emails**: To ensure participant privacy, the Admin permanently deletes all participant emails and any other personally identifiable information from the database.
