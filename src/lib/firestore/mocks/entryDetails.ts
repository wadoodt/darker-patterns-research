import type { EntryWithDetails } from '@/types/entryDetails';

export function getMockEntryDetails(entryId: string): EntryWithDetails {
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    id: entryId,
    instruction: 'Click the button to continue with your purchase',
    prompt: 'Generate a dark pattern for an e-commerce checkout flow',
    acceptedResponse: 'Continue to secure checkout',
    rejectedResponse: 'Warning: You may lose your cart items',
    category: 'Urgency',
    discussion: 'This pattern creates false urgency by implying potential loss.',
    reviewCount: randomInt(5, 15),
    targetReviewCount: 10,
    lastReviewedAt: lastWeek,
    createdAt: lastWeek,
    isFlaggedCount: randomInt(0, 3),
    lastFlaggedAt: now,
    isArchived: false,

    // Additional details for the admin view
    analytics: {
      views: randomInt(50, 500),
      flags: randomInt(0, 5),
      upvotes: randomInt(10, 100),
      lastViewedAt: now,
    },
    comments: [
      {
        id: '1',
        userId: `reviewer${randomInt(1, 5)}`,
        comment: 'This is a clear example of urgency-based manipulation',
        createdAt: lastWeek,
      },
      {
        id: '2',
        userId: `reviewer${randomInt(1, 5)}`,
        comment: 'The negative consequences are implied but not explicit',
        createdAt: now,
      },
    ],
    evaluations: [
      {
        id: 'eval1',
        rating: 4,
        comment: 'Strong example of dark pattern usage',
        submittedAt: lastWeek,
        chosenOptionKey: 'A',
        wasChosenActuallyAccepted: true,
      },
      {
        id: 'eval2',
        rating: 5,
        comment: 'Clear manipulation of user behavior',
        submittedAt: now,
        chosenOptionKey: 'B',
        wasChosenActuallyAccepted: false,
      },
    ],
  };
}
