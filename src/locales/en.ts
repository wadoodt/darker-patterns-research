export type Locale = typeof import('./en/shared') &
  typeof import('./en/ui') &
  typeof import('./en/api') & {
    pages: {
      auth: typeof import('./en/pages/auth'),
      team: typeof import('./en/pages/team')
    }
  };
