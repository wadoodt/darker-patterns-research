import type { DisplayEntry } from '@/types/entries';

export function getMockEntries(count: number = 10): DisplayEntry[] {
  return Array.from({ length: count }).map((_, i) => {
    const id = `mockEntry${i + 1}-${Math.random().toString(36).substring(2, 6)}`;
    const reviewCount = Math.floor(Math.random() * 10);
    const targetReviewCount = 10;
    const reviewProgress = Math.min(100, Math.round((reviewCount / targetReviewCount) * 100));
    return {
      id,
      instruction: `Mock instruction for entry ${i + 1}`,
      prompt: `Mock prompt for entry ${i + 1}`,
      acceptedResponse: `Mock accepted response for entry ${i + 1}`,
      rejectedResponse: `Mock rejected response for entry ${i + 1}`,
      category: i % 3 === 0 ? 'Obscuring Information' : i % 3 === 1 ? 'Misleading Content' : 'Privacy Harm',
      discussion: `Mock discussion for entry ${i + 1}`,
      reviewCount,
      targetReviewCount,
      reviewProgress,
      statusText: reviewCount >= targetReviewCount ? 'Completed' : `${reviewCount}/${targetReviewCount}`,
      isFlaggedCount: Math.floor(Math.random() * 3),
      isArchived: false,
    };
  });
}
