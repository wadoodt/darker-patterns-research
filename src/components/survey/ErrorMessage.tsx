import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null;

  return (
    <div className="mb-6 flex items-center gap-2 rounded-md border border-red-300 bg-red-100 p-3 text-xs text-red-700">
      <AlertTriangle size={16} /> {error}
    </div>
  );
};

export default ErrorMessage;
