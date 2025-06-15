import type { EntryComment } from '@/types/entryDetails';

interface EntryCommentsProps {
  comments: EntryComment[];
}

export function EntryComments({ comments }: EntryCommentsProps) {
  if (!comments?.length) return null;

  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">Review Comments</h2>
      <div className="rounded bg-gray-900 p-4">
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-b border-gray-200 pb-2 last:border-0">
              <div className="flex items-start justify-between">
                <strong>{comment.userId}</strong>
                <span className="text-sm text-gray-500">
                  {comment.createdAt instanceof Date
                    ? comment.createdAt.toLocaleDateString()
                    : new Date(comment.createdAt.seconds * 1000).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1">{comment.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
