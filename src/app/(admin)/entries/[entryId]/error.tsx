'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Entry error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="mb-4 text-2xl font-semibold">Something went wrong!</h2>
      <p className="mb-6 text-gray-600">An error occurred while loading this entry. Please try again.</p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
