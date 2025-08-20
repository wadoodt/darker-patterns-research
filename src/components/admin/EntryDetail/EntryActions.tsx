interface EntryActionsProps {
  onEdit: () => void;
  onFlag: () => void;
  disabled?: boolean;
}

export function EntryActions({ onEdit, onFlag, disabled = false }: EntryActionsProps) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xl font-semibold">Actions</h2>
      <div className="flex space-x-4">
        <button
          onClick={onEdit}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          Edit Entry
        </button>
        <button
          onClick={onFlag}
          className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          Flag Entry
        </button>
      </div>
    </section>
  );
}
