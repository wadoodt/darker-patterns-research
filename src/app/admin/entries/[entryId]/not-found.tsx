import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <h2 className="mb-4 text-2xl font-semibold">Entry Not Found</h2>
      <p className="mb-6 text-gray-600">The entry you are looking for does not exist or has been removed.</p>
      <Link href="/entries" className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
        Back to Entries
      </Link>
    </div>
  );
}
